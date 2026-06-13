# Backend Engineering Growth Roadmap
### From the Desk of a Principal Engineer — Optimized for Mastercard-Level Engineering

---

> **Philosophy**: At Mastercard, we don't hire people who built CRUD apps. We hire people who understand **why** they built things a certain way. Every feature below is chosen because it teaches you to think like an engineer who builds systems that process **billions of transactions**.

---

## Phase 1: Fix Your Foundation (The "You Won't Pass Our Code Review" Phase)

> [!CAUTION]
> No Mastercard interviewer will take your project seriously if it has raw `RuntimeException` throws, no transactions, and public fields on services. Phase 1 is **non-negotiable**.

---

### 1.1 — Custom Exception Hierarchy + Problem Detail (RFC 7807)

**Why Mastercard cares**: Every enterprise API returns structured error responses. When a payment fails at Mastercard, the downstream system needs a machine-readable error code, not a string. RFC 7807 (`application/problem+json`) is the industry standard.

**What to build**:
- Base `BusinessException` abstract class with error codes
- Domain exceptions: `EntityNotFoundException`, `DuplicateEntityException`, `InsufficientStockException`, `InvalidStateTransitionException`, `PaymentDeclinedException`
- Map each to proper HTTP status codes (404, 409, 422, 402)
- Return RFC 7807 `ProblemDetail` responses from `@RestControllerAdvice`
- Replace every `throw new RuntimeException(...)` in your codebase

**Spring Boot concepts learned**:
- `@RestControllerAdvice` + `@ExceptionHandler` (deep understanding, not surface-level)
- `ProblemDetail` class (Spring 6/Boot 3 native RFC 7807 support)
- Exception class hierarchies and when to use checked vs unchecked
- `ResponseStatusException` vs custom exception classes
- `@ResponseStatus` annotation

**Database concepts**: None directly, but error codes often map to constraint violation handling (`DataIntegrityViolationException`)

**Security concepts**: Never leak stack traces or internal details in production error responses. Attackers use exception messages for reconnaissance.

| Metric | Score |
|--------|-------|
| Difficulty | 3/10 |
| Resume Impact | 6/10 |
| Interview Impact | 8/10 |

> [!IMPORTANT]
> Interview question you'll be ready for: *"How do you handle errors in a RESTful API? What's the difference between returning a 400 vs 422? What is RFC 7807?"*

---

### 1.2 — `@Transactional` Mastery + Database Transaction Isolation

**Why Mastercard cares**: Mastercard processes ~$8.5 trillion/year. If a transaction debits an account but the credit fails, someone loses money. Transaction integrity is **the** #1 concern in financial engineering.

**What to build**:
- Add `@Transactional` to every service method that writes data
- Specifically on `OrderItemService.addproduct()` — this method modifies 3 tables (Product stock, OrderItem, SaleOrder total) with no atomicity
- Add `@Transactional(readOnly = true)` to all read-only methods
- Implement a deliberate failure test: throw an exception mid-operation and verify rollback
- Experiment with `@Transactional(isolation = Isolation.REPEATABLE_READ)` on stock deduction to prevent race conditions

**Spring Boot concepts learned**:
- `@Transactional` proxy mechanism — why it doesn't work on `private` methods or self-invocations
- Propagation levels: `REQUIRED`, `REQUIRES_NEW`, `NESTED` — when to use each
- Isolation levels: `READ_COMMITTED`, `REPEATABLE_READ`, `SERIALIZABLE`
- `TransactionTemplate` for programmatic transaction control
- Spring AOP proxy behavior (the #1 source of `@Transactional` bugs)

**Database concepts**:
- ACID properties (Atomicity, Consistency, Isolation, Durability)
- Transaction isolation levels in MySQL (InnoDB default = `REPEATABLE_READ`)
- Dirty reads, phantom reads, non-repeatable reads
- Row-level locking vs table-level locking
- Deadlock detection and resolution

**Security concepts**: Transaction integrity prevents data manipulation attacks and race-condition exploits (e.g., double-spend).

| Metric | Score |
|--------|-------|
| Difficulty | 5/10 |
| Resume Impact | 7/10 |
| Interview Impact | **10/10** |

> [!IMPORTANT]
> Interview question you'll be ready for: *"Explain what happens when two users try to buy the last item simultaneously. How does your system prevent overselling?"* — This is asked at **every** fintech interview.

---

### 1.3 — Order Status State Machine with Enum + Validation

**Why Mastercard cares**: Payment authorization flows through strict states: `INITIATED → AUTHORIZED → CAPTURED → SETTLED → REVERSED`. No company in payments allows free-text status fields.

**What to build**:
- `OrderStatus` enum: `DRAFT`, `CONFIRMED`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`, `RETURNED`
- Transition validation map: `DRAFT → CONFIRMED`, `CONFIRMED → PROCESSING | CANCELLED`, etc.
- Reject invalid transitions with `InvalidStateTransitionException`
- `@Enumerated(EnumType.STRING)` on the entity (never use `ORDINAL` — adding an enum value breaks everything)
- `OrderStatusHistory` entity logging every transition with timestamp and user who triggered it

**Spring Boot concepts learned**:
- `@Enumerated(EnumType.STRING)` vs `@Enumerated(EnumType.ORDINAL)` — and why ordinal is a production disaster
- State pattern / strategy pattern in service design
- `@PreUpdate` / `@PrePersist` JPA lifecycle callbacks for audit logging
- Custom validation with `@Valid` and `ConstraintValidator`

**Database concepts**:
- Storing enums in relational databases (string vs int tradeoffs)
- Audit/history tables (append-only patterns)
- Indexes on `status` columns for filtered queries

**Security concepts**: State machine prevents unauthorized state manipulation (e.g., a user skipping payment by setting status directly to `DELIVERED`).

| Metric | Score |
|--------|-------|
| Difficulty | 4/10 |
| Resume Impact | 7/10 |
| Interview Impact | 9/10 |

---

### 1.4 — Service Interface + Implementation Pattern

**Why Mastercard cares**: Every enterprise codebase uses interfaces for services. It enables mocking in tests, swapping implementations, and is fundamental to SOLID principles (Dependency Inversion).

**What to build**:
- Create interfaces: `IOrderService`, `IProductService`, `ICustomerService`, etc.
- Rename current services to `OrderServiceImpl`, `ProductServiceImpl`, etc.
- Controllers depend on the interface, not the implementation
- Later: create `OrderServiceMockImpl` for testing without database

**Spring Boot concepts learned**:
- Dependency Injection via interfaces — how Spring resolves beans
- `@Qualifier` for multiple implementations
- `@Primary` annotation
- Spring bean lifecycle and proxy creation
- Programming to interfaces vs implementations

**Database concepts**: None directly

**Security concepts**: Interface segregation allows different security policies per implementation

| Metric | Score |
|--------|-------|
| Difficulty | 2/10 |
| Resume Impact | 5/10 |
| Interview Impact | 7/10 |

---

### 1.5 — Proper Pagination, Sorting, and Filtering

**Why Mastercard cares**: Mastercard's merchant portal lists millions of transactions. Returning `findAll()` would crash the server. Every enterprise API is paginated.

**What to build**:
- All `GET` list endpoints accept `page`, `size`, `sortBy`, `sortDir` parameters
- Return `Page<T>` wrapper with metadata: `totalElements`, `totalPages`, `currentPage`, `hasNext`
- Use `Pageable` from Spring Data
- Add filtering: orders by date range, products by price range, orders by status
- Use JPA `Specification<T>` for dynamic filter composition

**Spring Boot concepts learned**:
- `Pageable` and `PageRequest` from Spring Data
- `Page<T>` vs `Slice<T>` (when you don't need total count)
- `Sort` object construction
- JPA `Specification<T>` and `CriteriaBuilder` for dynamic queries
- `@PageableDefault` annotation for defaults

**Database concepts**:
- `LIMIT` / `OFFSET` pagination and its performance implications at scale
- Keyset pagination (cursor-based) — why offset pagination breaks at millions of rows
- Composite indexes for `ORDER BY` + `WHERE` combinations
- Query execution plans with `EXPLAIN`

**Security concepts**: Pagination prevents denial-of-service via unbounded queries.

| Metric | Score |
|--------|-------|
| Difficulty | 4/10 |
| Resume Impact | 6/10 |
| Interview Impact | 8/10 |

---

## Phase 2: Strong Resume Features (The "This Candidate Knows Enterprise Java" Phase)

---

### 2.1 — Auditing Framework with `@EntityListeners` + `AuditorAware`

**Why Mastercard cares**: Regulatory compliance (PCI-DSS, SOX). Every data change must record **who** changed it and **when**. Mastercard is audited annually — missing audit trails = massive fines.

**What to build**:
- `BaseEntity` abstract class with `createdAt`, `updatedAt`, `createdBy`, `updatedBy` fields
- All entities extend `BaseEntity`
- `@EnableJpaAuditing` in config
- Custom `AuditorAware<String>` implementation that extracts the username from `SecurityContextHolder`
- `@CreatedDate`, `@LastModifiedDate`, `@CreatedBy`, `@LastModifiedBy` annotations

**Spring Boot concepts learned**:
- `@MappedSuperclass` for shared entity fields
- `@EntityListeners(AuditingEntityListener.class)`
- `AuditorAware<T>` interface and how Spring injects the current user
- `SecurityContextHolder` — ThreadLocal-based security context
- `@EnableJpaAuditing` bootstrap configuration

**Database concepts**:
- Audit columns pattern (most enterprise tables have these 4 columns)
- `DATETIME` vs `TIMESTAMP` in MySQL
- Timezone handling in databases (`UTC` everywhere)

**Security concepts**:
- Non-repudiation — proving who performed an action
- PCI-DSS Requirement 10: Track and monitor all access to network resources and cardholder data
- `SecurityContextHolder` architecture (ThreadLocal propagation)

| Metric | Score |
|--------|-------|
| Difficulty | 4/10 |
| Resume Impact | **9/10** |
| Interview Impact | 8/10 |

> [!IMPORTANT]
> Put "JPA Auditing with AuditorAware for compliance-grade audit trails" on your resume. Financial companies will notice immediately.

---

### 2.2 — Spring Profiles + Environment-Specific Configuration

**Why Mastercard cares**: Enterprise apps run in `dev`, `staging`, `qa`, `uat`, `prod` environments with different databases, different security settings, and different feature flags. Hardcoded config = production incidents.

**What to build**:
- `application-dev.properties` — H2 in-memory DB, relaxed security, SQL logging on
- `application-staging.properties` — MySQL, stricter security, no SQL logging
- `application-prod.properties` — MySQL, full security, no debug output, externalized secrets
- `@Profile("dev")` beans: a `DataInitializer` `CommandLineRunner` that seeds sample data
- Move JWT secret key to environment variable: `${JWT_SECRET_KEY}`
- Use `@ConfigurationProperties` to create a type-safe `JwtProperties` class

**Spring Boot concepts learned**:
- `@Profile` annotation and profile-specific beans
- `application-{profile}.properties` cascade resolution
- `@ConfigurationProperties` with `@Validated` — type-safe configuration binding
- `@Value` vs `@ConfigurationProperties` (when to use each)
- Externalized configuration hierarchy (env vars > system props > application.properties)
- `CommandLineRunner` / `ApplicationRunner` for startup tasks

**Database concepts**:
- H2 in-memory databases for development/testing
- Database migration strategy across environments

**Security concepts**:
- **Never hardcode secrets** — the JWT key in your current `application.properties` is a critical security violation
- 12-Factor App methodology (III: Store config in the environment)
- Secret management patterns (Vault, AWS Secrets Manager concepts)

| Metric | Score |
|--------|-------|
| Difficulty | 3/10 |
| Resume Impact | 7/10 |
| Interview Impact | 8/10 |

---

### 2.3 — Database Migrations with Flyway

**Why Mastercard cares**: Production databases are never managed with `ddl-auto=update`. That's how you lose production data. Every schema change goes through versioned, reviewable, reversible migration scripts.

**What to build**:
- Add Flyway dependency
- Remove `spring.jpa.hibernate.ddl-auto=update` (this is a **production disaster waiting to happen**)
- Create `V1__initial_schema.sql` with all current tables
- Create `V2__add_payment_table.sql` for new features
- Add `V3__add_audit_columns.sql` for the auditing feature
- Set up Flyway to run on application startup

**Spring Boot concepts learned**:
- Flyway auto-configuration in Spring Boot
- Version-based schema migration
- `spring.flyway.*` configuration properties
- Difference between Flyway and Liquibase (and when to use which)
- How `ddl-auto=update` silently drops columns and why it's banned in production

**Database concepts**:
- Schema migration and version control
- Forward-only vs reversible migrations
- Migration ordering and idempotency
- Schema change impact analysis
- Blue-green deployment database considerations

**Security concepts**: Schema migrations must be reviewed — a malicious migration could drop audit tables.

| Metric | Score |
|--------|-------|
| Difficulty | 3/10 |
| Resume Impact | **9/10** |
| Interview Impact | **9/10** |

> [!WARNING]
> If an interviewer sees `ddl-auto=update` in your project, the interview is effectively over. Flyway/Liquibase knowledge is a **hard requirement** at any enterprise company.

---

### 2.4 — Caching with Spring Cache + Redis

**Why Mastercard cares**: Mastercard's authorization network needs sub-100ms response times. You can't hit a database for every merchant lookup or BIN (card number prefix) validation. Caching is fundamental infrastructure.

**What to build**:
- Add `spring-boot-starter-cache` and `spring-boot-starter-data-redis`
- `@EnableCaching` on config
- `@Cacheable("products")` on product lookup by ID
- `@CacheEvict("products")` on product update/delete
- `@CachePut` on product creation
- Cache product catalog and customer lookups
- Add cache TTL configuration
- Monitor cache hit rates with Actuator

**Spring Boot concepts learned**:
- `@Cacheable`, `@CacheEvict`, `@CachePut` annotations
- `CacheManager` abstraction and how Spring swaps backends (in-memory ↔ Redis ↔ Caffeine)
- Cache key generation and `@Cacheable(key = "#id")`
- `spring-boot-starter-data-redis` auto-configuration
- `RedisTemplate` for manual cache operations
- Cache-aside vs write-through vs write-behind patterns

**Database concepts**:
- Read-heavy vs write-heavy workload optimization
- Cache invalidation strategies (TTL, event-based, manual)
- The "two hardest problems in CS": cache invalidation and naming things

**Security concepts**: Cache poisoning attacks. Sensitive data in cache must have TTL and not be shared across tenants.

| Metric | Score |
|--------|-------|
| Difficulty | 5/10 |
| Resume Impact | **9/10** |
| Interview Impact | **10/10** |

> [!IMPORTANT]
> Interview question you'll be ready for: *"Your product catalog has 100k products queried 10k times/second. How do you avoid crushing your database?"*

---

### 2.5 — Comprehensive Testing Strategy (Unit + Integration + Contract)

**Why Mastercard cares**: Mastercard's CI/CD pipeline runs thousands of tests on every commit. Untested code does not ship. Period.

**What to build**:
- **Unit tests** for service layer using Mockito: mock repositories, test business logic in isolation
- **Integration tests** using `@SpringBootTest` + `@Testcontainers` with a real MySQL container
- **Controller tests** using `@WebMvcTest` + `MockMvc` — test request/response serialization, validation, security
- **Repository tests** using `@DataJpaTest` — test custom queries
- Test security: verify `ADMIN`-only endpoints reject `SALES_PERSON` tokens
- Target: **70%+ line coverage on service layer**

**Spring Boot concepts learned**:
- `@SpringBootTest` vs `@WebMvcTest` vs `@DataJpaTest` — sliced test contexts
- `@MockBean` for replacing beans in Spring context
- `MockMvc` for HTTP-level controller testing
- `Testcontainers` for real database integration tests
- `@WithMockUser` and `@WithUserDetails` for security testing
- `@Sql` for test data loading
- Test configuration with `@TestConfiguration`

**Database concepts**:
- Testcontainers — spinning up ephemeral databases for tests
- Test data management and cleanup
- Transaction rollback in tests (`@Transactional` on tests)

**Security concepts**:
- Security testing: verify RBAC rules, verify JWT validation, verify unauthenticated access is blocked
- `@WithMockUser(roles = "ADMIN")` for role-based test scenarios

| Metric | Score |
|--------|-------|
| Difficulty | 6/10 |
| Resume Impact | **10/10** |
| Interview Impact | **10/10** |

> [!CAUTION]
> A project with zero tests is a **liability** on your resume. A project with 70%+ coverage with Testcontainers is a **weapon**. This is the single highest-ROI item on this entire roadmap.

---

## Phase 3: Advanced Enterprise Features (The "This Candidate Built Real Systems" Phase)

---

### 3.1 — Event-Driven Architecture with Spring Events + Async Processing

**Why Mastercard cares**: When a payment is authorized, dozens of things happen: fraud check, notification, ledger update, reporting, loyalty points. These are **not** sequential. They're events processed asynchronously.

**What to build**:
- `OrderConfirmedEvent`, `PaymentReceivedEvent`, `StockDepletedEvent` — custom application events
- `@EventListener` handlers: when order is confirmed → deduct stock, send notification, log audit
- `@Async` event listeners for non-blocking processing
- `@TransactionalEventListener(phase = AFTER_COMMIT)` — only fire events after the transaction commits (critical: don't send a "payment confirmed" email if the DB write rolls back)
- `AsyncConfig` with custom `ThreadPoolTaskExecutor`

**Spring Boot concepts learned**:
- `ApplicationEventPublisher` and `@EventListener`
- `@TransactionalEventListener` and transaction phase binding
- `@Async` + `@EnableAsync` — Spring's async processing model
- `ThreadPoolTaskExecutor` configuration (core pool, max pool, queue capacity)
- Loose coupling via the Observer pattern
- Event sourcing concepts (intro-level)

**Database concepts**:
- Eventual consistency vs strong consistency
- Outbox pattern (store events in DB, process separately — prevents lost events)

**Security concepts**: Async processing must propagate security context. `SecurityContextHolder` is `ThreadLocal` — it doesn't auto-propagate to new threads. You need `DelegatingSecurityContextExecutor`.

| Metric | Score |
|--------|-------|
| Difficulty | 6/10 |
| Resume Impact | **9/10** |
| Interview Impact | **10/10** |

---

### 3.2 — Payment Module with Optimistic Locking + Idempotency

**Why Mastercard cares**: This is literally Mastercard's core business. Double-charging a customer is a lawsuit. Missing a charge is lost revenue. Payment APIs must be **idempotent** — calling them twice with the same request must produce the same result.

**What to build**:
- `Payment` entity: `id`, `orderId`, `amount`, `method` (enum: CASH, CARD, UPI, BANK_TRANSFER), `status` (PENDING, COMPLETED, FAILED, REFUNDED), `idempotencyKey` (UUID), `transactionDate`
- `@Version` field on `Payment` and `SaleOrder` for optimistic locking
- Idempotency: client sends `Idempotency-Key` header → if a payment with that key exists, return the cached result instead of processing again
- Payment status validation: only `CONFIRMED` orders can be paid, only `COMPLETED` payments can be refunded
- `@Transactional(isolation = SERIALIZABLE)` on payment processing

**Spring Boot concepts learned**:
- `@Version` for JPA optimistic locking
- `OptimisticLockingFailureException` handling and retry logic
- Custom HTTP header extraction with `@RequestHeader`
- `HandlerInterceptor` for idempotency middleware
- Retry patterns with `@Retryable` (Spring Retry)

**Database concepts**:
- Optimistic locking vs pessimistic locking — when to use each
- `@Version` column mechanics (auto-increment on update, fails if stale)
- Unique constraints for idempotency keys
- Serializable isolation — how it prevents phantom reads
- Double-write prevention patterns

**Security concepts**:
- Idempotency prevents replay attacks
- Payment data requires PCI-DSS awareness (never store full card numbers)
- Encryption at rest for sensitive financial data

| Metric | Score |
|--------|-------|
| Difficulty | 7/10 |
| Resume Impact | **10/10** |
| Interview Impact | **10/10** |

> [!IMPORTANT]
> If you can explain optimistic locking and idempotent payment APIs in a Mastercard interview, you are **ahead of 90% of candidates**.

---

### 3.3 — API Versioning + HATEOAS (Mature REST API Design)

**Why Mastercard cares**: Mastercard's APIs serve thousands of partner banks and merchants. You can't break existing integrations when you update your API. Versioning and discoverability are mandatory.

**What to build**:
- URL versioning: `/api/v1/orders`, `/api/v2/orders`
- `V1` returns current DTOs, `V2` adds new fields/structure
- Spring HATEOAS: responses include links to related resources (`_links: { self, items, payment, cancel }`)
- Use `RepresentationModel<T>` and `WebMvcLinkBuilder` for hypermedia links
- API deprecation headers: `Sunset: Sat, 01 Jan 2028 00:00:00 GMT`

**Spring Boot concepts learned**:
- `spring-boot-starter-hateoas`
- `RepresentationModel`, `EntityModel`, `CollectionModel`
- `WebMvcLinkBuilder.linkTo().methodOn()` — type-safe link building
- API versioning strategies (URL vs header vs content-type)
- `@RequestMapping` path composition for versioning
- Custom `HttpMessageConverter` for version-specific serialization

**Database concepts**: None directly — versioning is an API concern

**Security concepts**: API versioning allows gradual security upgrades without breaking legacy clients.

| Metric | Score |
|--------|-------|
| Difficulty | 5/10 |
| Resume Impact | 7/10 |
| Interview Impact | 8/10 |

---

### 3.4 — Scheduling + Batch Processing with `@Scheduled` and Spring Batch

**Why Mastercard cares**: End-of-day settlement, monthly reconciliation, nightly fraud scan reports — enterprise systems are powered by batch jobs as much as APIs.

**What to build**:
- `@Scheduled(cron = "0 0 * * * *")` — hourly job to auto-cancel orders in `DRAFT` status for >24 hours
- `@Scheduled` daily report generation: revenue summary, low-stock alerts
- Spring Batch job: process a CSV of bulk product imports (read → validate → transform → write to DB)
- Job execution tracking: log when jobs run, how long they take, whether they succeed or fail

**Spring Boot concepts learned**:
- `@EnableScheduling` + `@Scheduled` (cron, fixedRate, fixedDelay)
- Spring Batch: `Job`, `Step`, `ItemReader`, `ItemProcessor`, `ItemWriter`
- `JobRepository` for batch job metadata
- Chunk-oriented processing (read N items, process, write in batch)
- `TaskScheduler` for programmatic scheduling
- Thread pool management for scheduled tasks

**Database concepts**:
- Batch inserts with `saveAll()` vs individual `save()` performance
- `spring.jpa.properties.hibernate.jdbc.batch_size`
- Bulk operations and `EntityManager.flush()` / `clear()` for memory management

**Security concepts**: Scheduled jobs run without a user context — they need a `@Scheduled` security principal or system-level credentials.

| Metric | Score |
|--------|-------|
| Difficulty | 6/10 |
| Resume Impact | 8/10 |
| Interview Impact | 7/10 |

---

### 3.5 — Observability: Actuator + Micrometer + Structured Logging

**Why Mastercard cares**: When a system processes billions of transactions, you don't debug by reading logs. You debug with metrics, traces, and dashboards. Observability is a **core engineering competency** at any enterprise.

**What to build**:
- `spring-boot-starter-actuator` — expose health, metrics, info endpoints
- Custom health indicators: `DatabaseHealthIndicator`, `CacheHealthIndicator`
- Micrometer metrics: custom counters for `orders.created`, `payments.processed`, `orders.failed`
- Structured JSON logging with Logback + MDC (Mapped Diagnostic Context)
- Add `correlationId` to every request (via `Filter`) — trace a single request across all log lines
- Custom `@Timed` annotations on service methods

**Spring Boot concepts learned**:
- `spring-boot-starter-actuator` auto-configuration
- Custom `HealthIndicator` beans
- Micrometer `MeterRegistry`, `Counter`, `Timer`, `Gauge`
- `@Timed` annotation for method-level metrics
- MDC (Mapped Diagnostic Context) for request-scoped logging context
- `Filter` / `HandlerInterceptor` for request correlation
- Logback XML configuration and JSON log formatters

**Database concepts**:
- Connection pool metrics (HikariCP exposes metrics via Micrometer)
- Slow query logging and monitoring

**Security concepts**: Actuator endpoints must be secured — `/actuator/env` can expose secrets. Restrict with `management.endpoints.web.exposure.include`.

| Metric | Score |
|--------|-------|
| Difficulty | 5/10 |
| Resume Impact | **9/10** |
| Interview Impact | **9/10** |

> [!IMPORTANT]
> Interview question you'll be ready for: *"Your payment service starts timing out in production. You can't reproduce it locally. How do you diagnose it?"* — Without observability knowledge, you have no answer.

---

## Phase 4: Mastercard-Level Backend Engineering (The "Hire This Person" Phase)

---

### 4.1 — Rate Limiting + API Throttling with Bucket4j or Resilience4j

**Why Mastercard cares**: Mastercard enforces strict rate limits on every API. A misbehaving merchant app making 100k requests/second could bring down the authorization network. Rate limiting protects the entire ecosystem.

**What to build**:
- Resilience4j `@RateLimiter` on `/auth/login` (prevent brute-force)
- Per-user rate limits using token bucket algorithm
- Return `429 Too Many Requests` with `Retry-After` header
- `@CircuitBreaker` on external service calls (prep for microservice patterns)
- `@Retry` with exponential backoff for transient failures
- `@Bulkhead` for resource isolation

**Spring Boot concepts learned**:
- `resilience4j-spring-boot3` auto-configuration
- `@RateLimiter`, `@CircuitBreaker`, `@Retry`, `@Bulkhead` annotations
- Fallback methods for degraded functionality
- `actuator` integration for circuit breaker state monitoring
- AOP-based annotation processing (how Resilience4j wraps methods)

**Database concepts**: Rate limit state can be stored in Redis for distributed rate limiting across multiple app instances.

**Security concepts**:
- Brute-force attack prevention on login endpoints
- DDoS mitigation at the application layer
- API abuse prevention — a core concern in financial APIs

| Metric | Score |
|--------|-------|
| Difficulty | 6/10 |
| Resume Impact | **9/10** |
| Interview Impact | **10/10** |

---

### 4.2 — Distributed Tracing with Spring Cloud Sleuth / Micrometer Tracing

**Why Mastercard cares**: A single card swipe triggers 15+ service calls across authorization, fraud detection, currency conversion, settlement, and notification systems. When something fails, you need to trace the exact path of that request across every service.

**What to build**:
- `micrometer-tracing-bridge-otel` for OpenTelemetry tracing
- Trace ID propagation in HTTP headers (`traceparent`)
- Correlate logs across services using trace/span IDs
- Export traces to Zipkin (run locally via Docker)
- Visualize request flow across service boundaries
- Add custom spans to critical business operations (payment processing)

**Spring Boot concepts learned**:
- `micrometer-tracing` auto-configuration
- `ObservationRegistry` and `@Observed` annotation
- Trace context propagation in `RestTemplate` / `WebClient`
- Span lifecycle management
- OpenTelemetry concepts (traces, spans, baggage)
- Integration with logging MDC

**Database concepts**: Database query spans — seeing exactly which queries are slow within a trace.

**Security concepts**: Trace IDs should not leak sensitive data. Trace sampling strategies for high-throughput systems.

| Metric | Score |
|--------|-------|
| Difficulty | 7/10 |
| Resume Impact | 8/10 |
| Interview Impact | **9/10** |

---

### 4.3 — Multi-Tenant Data Isolation with `@Filter` / `@FilterDef`

**Why Mastercard cares**: Mastercard serves thousands of issuing banks on the same platform. Bank A must **never** see Bank B's data. Tenant isolation is a non-negotiable security requirement.

**What to build**:
- Each entity gets a `tenantId` column (simulate: each SalesPerson is a "tenant" who can only see their own orders)
- Hibernate `@FilterDef` + `@Filter` that automatically appends `WHERE tenant_id = :currentTenant` to every query
- `TenantFilter` that extracts tenant ID from JWT claims and applies the Hibernate filter
- Test: SalesPerson A cannot see SalesPerson B's orders — even if they guess the order ID

**Spring Boot concepts learned**:
- Hibernate `@FilterDef` and `@Filter` — query-level data isolation
- `EntityManager` session-level filter activation
- Custom `HandlerInterceptor` for tenant context setup
- `ThreadLocal`-based tenant context propagation
- `@PostConstruct` / `@PreDestroy` lifecycle management

**Database concepts**:
- Row-level security patterns
- Discriminator-based multi-tenancy vs schema-based vs database-based
- Composite indexes with `tenant_id` prefix
- Query plan impact of adding `WHERE tenant_id = ?` to every query

**Security concepts**:
- Tenant isolation — the most critical security concern in SaaS
- IDOR (Insecure Direct Object Reference) prevention
- Zero-trust data access patterns

| Metric | Score |
|--------|-------|
| Difficulty | 8/10 |
| Resume Impact | **10/10** |
| Interview Impact | **10/10** |

> [!IMPORTANT]
> Interview question you'll be ready for: *"How do you ensure that Customer A never sees Customer B's data in a shared database?"* — If you can answer this with Hibernate filters, row-level security, and JWT-based tenant context, you **will** impress.

---

### 4.4 — Spring Security Deep Dive: OAuth2 Resource Server + Method-Level Security

**Why Mastercard cares**: Mastercard uses OAuth2 for its API ecosystem. Understanding token validation, scopes, claims-based authorization, and method-level security is **expected** of every backend engineer.

**What to build**:
- Replace custom JWT filter with Spring Security's `spring-boot-starter-oauth2-resource-server`
- Configure JWT decoder with `spring.security.oauth2.resourceserver.jwt.*`
- Method-level security with `@PreAuthorize("hasRole('ADMIN')")` and `@PreAuthorize("#orderId == authentication.principal.id")`
- Custom `PermissionEvaluator` — "can this salesperson access this specific order?"
- `@PostAuthorize` — filter response data based on user role

**Spring Boot concepts learned**:
- `spring-boot-starter-oauth2-resource-server` auto-configuration
- JWT decoder configuration (JWK Set URI, issuer validation)
- `@PreAuthorize` and Spring Expression Language (SpEL)
- Custom `PermissionEvaluator` for domain-object-level authorization
- `@Secured` vs `@RolesAllowed` vs `@PreAuthorize` — when to use each
- `JwtAuthenticationConverter` for custom claims-to-authorities mapping
- `@EnableMethodSecurity` configuration

**Database concepts**: None directly

**Security concepts**:
- OAuth2 architecture (Authorization Server vs Resource Server)
- JWT validation: signature, expiry, issuer, audience
- Claims-based vs role-based vs permission-based authorization
- Principle of Least Privilege in API design
- Object-level authorization (IDOR prevention at the framework level)

| Metric | Score |
|--------|-------|
| Difficulty | 8/10 |
| Resume Impact | **10/10** |
| Interview Impact | **10/10** |

---

### 4.5 — Docker + CI/CD Pipeline

**Why Mastercard cares**: Every Mastercard service is containerized and deployed via CI/CD. If you can't containerize your app and automate its testing/deployment, you can't work at any modern enterprise.

**What to build**:
- Multi-stage `Dockerfile` (build stage with Maven, runtime stage with JRE-only)
- `docker-compose.yml` with MySQL, Redis, and your app
- GitHub Actions CI pipeline: checkout → test → build → Docker image push
- Run tests with Testcontainers in CI
- Health check endpoint integration with Docker `HEALTHCHECK`
- Environment-specific Docker Compose overrides

**Spring Boot concepts learned**:
- Spring Boot's layered JAR support for efficient Docker caching
- `spring-boot-docker-compose` module (Boot 3.1+ native Docker Compose support)
- Graceful shutdown with `server.shutdown=graceful`
- Actuator health endpoint for container orchestration

**Database concepts**:
- Database containers for local development
- Database connection configuration via environment variables
- Volume mounting for persistent data

**Security concepts**:
- Non-root Docker containers
- Secret injection via environment variables (not baked into images)
- Minimal base images to reduce attack surface (`eclipse-temurin:17-jre-alpine`)

| Metric | Score |
|--------|-------|
| Difficulty | 6/10 |
| Resume Impact | **10/10** |
| Interview Impact | 8/10 |

---

## Master Scorecard

| # | Feature | Difficulty | Resume | Interview | Phase |
|---|---------|:---:|:---:|:---:|:---:|
| 1.1 | Custom Exception Hierarchy + RFC 7807 | 3 | 6 | 8 | 1 |
| 1.2 | `@Transactional` + Isolation Levels | 5 | 7 | **10** | 1 |
| 1.3 | Order Status State Machine | 4 | 7 | 9 | 1 |
| 1.4 | Service Interface Pattern | 2 | 5 | 7 | 1 |
| 1.5 | Pagination + Filtering + Specifications | 4 | 6 | 8 | 1 |
| 2.1 | JPA Auditing + `AuditorAware` | 4 | **9** | 8 | 2 |
| 2.2 | Spring Profiles + Externalized Config | 3 | 7 | 8 | 2 |
| 2.3 | Flyway Database Migrations | 3 | **9** | **9** | 2 |
| 2.4 | Caching with Redis | 5 | **9** | **10** | 2 |
| 2.5 | Comprehensive Testing Strategy | 6 | **10** | **10** | 2 |
| 3.1 | Event-Driven Architecture | 6 | **9** | **10** | 3 |
| 3.2 | Payment + Optimistic Locking + Idempotency | 7 | **10** | **10** | 3 |
| 3.3 | API Versioning + HATEOAS | 5 | 7 | 8 | 3 |
| 3.4 | Scheduling + Spring Batch | 6 | 8 | 7 | 3 |
| 3.5 | Observability + Actuator + Micrometer | 5 | **9** | **9** | 3 |
| 4.1 | Rate Limiting + Circuit Breakers | 6 | **9** | **10** | 4 |
| 4.2 | Distributed Tracing | 7 | 8 | **9** | 4 |
| 4.3 | Multi-Tenant Data Isolation | 8 | **10** | **10** | 4 |
| 4.4 | OAuth2 Resource Server + Method Security | 8 | **10** | **10** | 4 |
| 4.5 | Docker + CI/CD Pipeline | 6 | **10** | 8 | 4 |

---

## The One Slide That Gets You Hired

When you complete all 4 phases, your resume bullet reads:

> **Sales & Order Management System** — Spring Boot 4, Java 17
> - Built a **transactional order management system** with JWT/OAuth2 authentication, RBAC, and **row-level multi-tenant data isolation**
> - Implemented **idempotent payment APIs** with optimistic locking, preventing double-charge scenarios
> - Designed **event-driven order workflows** with transactional event listeners and async processing
> - Achieved **70%+ test coverage** using JUnit 5, Mockito, Testcontainers (MySQL), and MockMvc security tests
> - Added **Redis caching** (product catalog), **Flyway migrations**, **structured logging with correlation IDs**, and **Micrometer metrics** with Actuator
> - Containerized with **multi-stage Docker build** and **GitHub Actions CI/CD** pipeline
> - Implemented **Resilience4j** rate limiting, circuit breakers, and retry patterns on critical endpoints

That resume bullet tells a Principal Engineer at Mastercard: *"This person doesn't just write Spring Boot apps. They understand how enterprise systems work."*
