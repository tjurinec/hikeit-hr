package hr.vrhiput.entity

import jakarta.persistence.*
import java.time.OffsetDateTime

@Entity
@Table(name = "admin_users")
class AdminUser(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(nullable = false, unique = true, length = 100)
    val username: String = "",

    @Column(nullable = false, length = 255)
    val password: String = "",

    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: OffsetDateTime = OffsetDateTime.now(),
)
