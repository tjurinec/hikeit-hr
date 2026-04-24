package hr.vrhiput.entity

import jakarta.persistence.*
import java.time.OffsetDateTime

@Entity
@Table(name = "guides")
class Guide(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(nullable = false, length = 100)
    var name: String = "",

    @Column(columnDefinition = "TEXT")
    var bio: String? = null,

    @Column(name = "avatar_url", length = 500)
    var avatarUrl: String? = null,

    @Column(length = 200)
    var specialization: String? = null,

    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: OffsetDateTime = OffsetDateTime.now(),
)
