package hr.vrhiput.entity

import jakarta.persistence.*
import java.time.OffsetDateTime

@Entity
@Table(name = "contact_messages")
class ContactMessage(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(nullable = false, length = 120)
    var name: String = "",

    @Column(nullable = false, length = 200)
    var email: String = "",

    @Column(length = 50)
    var phone: String? = null,

    @Column(length = 120)
    var subject: String? = null,

    @Column(nullable = false, columnDefinition = "TEXT")
    var message: String = "",

    /** Označava da je upit riješen — da se popis u adminu može pročistiti. */
    @Column(nullable = false)
    var handled: Boolean = false,

    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: OffsetDateTime = OffsetDateTime.now(),
)
