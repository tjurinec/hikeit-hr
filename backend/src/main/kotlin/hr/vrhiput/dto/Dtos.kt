package hr.vrhiput.dto

import hr.vrhiput.entity.Difficulty
import hr.vrhiput.entity.Excursion
import hr.vrhiput.entity.GalleryImage
import hr.vrhiput.entity.Guide
import java.math.BigDecimal
import java.time.LocalDate
import java.time.OffsetDateTime

data class GuideDto(
    val id: Long,
    val name: String,
    val bio: String?,
    val avatarUrl: String?,
    val specialization: String?,
)

data class ExcursionSummaryDto(
    val id: Long,
    val title: String,
    val slug: String,
    val description: String,
    val difficulty: Difficulty,
    val durationDays: Int,
    val maxParticipants: Int,
    val price: BigDecimal?,
    val coverImageUrl: String?,
    val location: String?,
    val startingPoint: String?,
    val guide: GuideDto?,
    val tags: Set<String>,
    val publishedAt: OffsetDateTime?,
    val nextDeparture: LocalDate?,
)

data class ExcursionDetailDto(
    val id: Long,
    val title: String,
    val slug: String,
    val description: String,
    val content: String?,
    val difficulty: Difficulty,
    val durationDays: Int,
    val maxParticipants: Int,
    val price: BigDecimal?,
    val coverImageUrl: String?,
    val imageUrls: List<String>,
    val location: String?,
    val startingPoint: String?,
    val guide: GuideDto?,
    val tags: Set<String>,
    val publishedAt: OffsetDateTime?,
    val nextDeparture: LocalDate?,
)

data class GalleryImageDto(
    val id: Long,
    val url: String,
    val caption: String?,
    val location: String?,
    val category: String?,
    val excursionTitle: String?,
)

fun Guide.toDto() = GuideDto(id, name, bio, avatarUrl, specialization)

fun Excursion.toSummaryDto() = ExcursionSummaryDto(
    id, title, slug, description, difficulty, durationDays, maxParticipants,
    price, coverImageUrl, location, startingPoint, guide?.toDto(), tags, publishedAt, nextDeparture,
)

fun Excursion.toDetailDto() = ExcursionDetailDto(
    id, title, slug, description, content, difficulty, durationDays, maxParticipants,
    price, coverImageUrl, images.map { it.url }, location, startingPoint,
    guide?.toDto(), tags, publishedAt, nextDeparture,
)

fun GalleryImage.toDto() = GalleryImageDto(id, url, caption, location, category, excursion?.title)
