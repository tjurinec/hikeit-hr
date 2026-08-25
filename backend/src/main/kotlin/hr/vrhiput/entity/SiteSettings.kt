package hr.vrhiput.entity

import jakarta.persistence.*
import java.time.OffsetDateTime

@Embeddable
class ContactPhone(
    /** Opis broja, npr. "Tomislav" ili "WhatsApp". */
    @Column(length = 100)
    var label: String? = null,

    @Column(name = "number", nullable = false, length = 50)
    var number: String = "",
)

@Entity
@Table(name = "site_settings")
class SiteSettings(
    @Id
    val id: Long = 1,

    @Column(name = "contact_email", length = 200)
    var contactEmail: String? = null,

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "contact_phones", joinColumns = [JoinColumn(name = "settings_id")])
    @OrderColumn(name = "sort_order")
    var phones: MutableList<ContactPhone> = mutableListOf(),

    @Column(length = 200)
    var location: String? = null,

    @Column(name = "location_note", length = 200)
    var locationNote: String? = null,

    @Column(name = "working_hours", columnDefinition = "TEXT")
    var workingHours: String? = null,

    @Column(name = "working_hours_note", length = 300)
    var workingHoursNote: String? = null,

    @Column(name = "instagram_url", length = 300)
    var instagramUrl: String? = null,

    @Column(name = "facebook_url", length = 300)
    var facebookUrl: String? = null,

    @Column(name = "updated_at", nullable = false)
    var updatedAt: OffsetDateTime = OffsetDateTime.now(),
)
