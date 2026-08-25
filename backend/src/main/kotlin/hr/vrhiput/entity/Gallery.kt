package hr.vrhiput.entity

import jakarta.persistence.*
import org.hibernate.annotations.BatchSize
import java.time.OffsetDateTime

@Entity
@Table(name = "galleries")
class Gallery(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(nullable = false, length = 200)
    var title: String = "",

    @Column(columnDefinition = "TEXT")
    var description: String? = null,

    /** Link na vanjsku galeriju (Google Photos i sl.). */
    @Column(name = "external_url", length = 500)
    var externalUrl: String? = null,

    @Column(name = "sort_order", nullable = false)
    var sortOrder: Int = 0,

    // LAZY + BatchSize: uz EAGER bi Hibernate kod paginacije dohvatio sve
    // galerije i rezao ih u memoriji (HHH000104). BatchSize drži broj upita na dva.
    @OneToMany(mappedBy = "gallery", cascade = [CascadeType.ALL], orphanRemoval = true, fetch = FetchType.LAZY)
    @BatchSize(size = 25)
    @OrderBy("sortOrder ASC")
    var images: MutableList<GalleryImage> = mutableListOf(),

    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: OffsetDateTime = OffsetDateTime.now(),
)
