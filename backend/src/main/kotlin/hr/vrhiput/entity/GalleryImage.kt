package hr.vrhiput.entity

import jakarta.persistence.*
import java.time.OffsetDateTime

@Entity
@Table(name = "gallery_images")
class GalleryImage(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(nullable = false, length = 500)
    var url: String = "",

    @Column(length = 500)
    var caption: String? = null,

    @Column(length = 255)
    var location: String? = null,

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "gallery_id")
    var gallery: Gallery? = null,

    @Column(name = "sort_order", nullable = false)
    var sortOrder: Int = 0,

    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: OffsetDateTime = OffsetDateTime.now(),
)
