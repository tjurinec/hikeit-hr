package hr.vrhiput.entity

import jakarta.persistence.*

@Entity
@Table(name = "excursion_images")
class ExcursionImage(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "excursion_id", nullable = false)
    var excursion: Excursion? = null,

    @Column(nullable = false, length = 500)
    var url: String = "",

    @Column(name = "sort_order", nullable = false)
    var sortOrder: Int = 0,
)
