package hr.vrhiput.entity

import jakarta.persistence.*
import java.math.BigDecimal
import java.time.LocalDate
import java.time.OffsetDateTime

enum class Difficulty { EASY, MODERATE, HARD, EXPERT }

@Entity
@Table(name = "excursions")
class Excursion(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(nullable = false)
    var title: String = "",

    @Column(nullable = false, unique = true)
    var slug: String = "",

    @Column(nullable = false, columnDefinition = "TEXT")
    var description: String = "",

    @Column(columnDefinition = "TEXT")
    var content: String? = null,

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "difficulty")
    var difficulty: Difficulty = Difficulty.MODERATE,

    @Column(name = "duration_days", nullable = false)
    var durationDays: Int = 1,

    @Column(name = "max_participants", nullable = false)
    var maxParticipants: Int = 10,

    @Column(precision = 10, scale = 2)
    var price: BigDecimal? = null,

    @Column(name = "cover_image_url", length = 500)
    var coverImageUrl: String? = null,

    @Column(length = 255)
    var location: String? = null,

    @Column(name = "starting_point", length = 255)
    var startingPoint: String? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "guide_id")
    var guide: Guide? = null,

    @Column(nullable = false)
    var featured: Boolean = false,

    @Column(nullable = false)
    var published: Boolean = false,

    @Column(name = "published_at")
    var publishedAt: OffsetDateTime? = null,

    @Column(name = "next_departure")
    var nextDeparture: LocalDate? = null,

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "excursion_tags", joinColumns = [JoinColumn(name = "excursion_id")])
    @Column(name = "tag")
    var tags: MutableSet<String> = mutableSetOf(),

    @OneToMany(mappedBy = "excursion", cascade = [CascadeType.ALL], orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("sortOrder ASC")
    var images: MutableList<ExcursionImage> = mutableListOf(),

    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: OffsetDateTime = OffsetDateTime.now(),

    @Column(name = "updated_at", nullable = false)
    var updatedAt: OffsetDateTime = OffsetDateTime.now(),
)
