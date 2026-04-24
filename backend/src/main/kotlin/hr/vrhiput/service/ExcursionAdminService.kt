package hr.vrhiput.service

import hr.vrhiput.dto.CreateExcursionRequest
import hr.vrhiput.dto.ExcursionDetailDto
import hr.vrhiput.dto.toDetailDto
import hr.vrhiput.entity.Excursion
import hr.vrhiput.repository.ExcursionRepository
import hr.vrhiput.repository.GuideRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.OffsetDateTime

@Service
class ExcursionAdminService(
    private val excursionRepo: ExcursionRepository,
    private val guideRepo: GuideRepository,
) {

    @Transactional
    fun create(req: CreateExcursionRequest): ExcursionDetailDto {
        val slug = generateSlug(req.title)
        val guide = req.guideId?.let { guideRepo.findById(it).orElse(null) }

        val excursion = Excursion(
            title = req.title,
            slug = slug,
            description = req.description,
            content = req.content,
            difficulty = req.difficulty,
            durationDays = req.durationDays,
            maxParticipants = req.maxParticipants,
            price = req.price,
            coverImageUrl = req.coverImageUrl,
            location = req.location,
            startingPoint = req.startingPoint,
            guide = guide,
            tags = req.tags.toMutableSet(),
            featured = req.featured,
            published = req.published,
            publishedAt = if (req.published) OffsetDateTime.now() else null,
            nextDeparture = req.nextDeparture,
        )
        return excursionRepo.save(excursion).toDetailDto()
    }

    @Transactional
    fun update(id: Long, req: CreateExcursionRequest): ExcursionDetailDto {
        val excursion = excursionRepo.findById(id)
            .orElseThrow { NoSuchElementException("Izlet $id nije pronađen") }
        val guide = req.guideId?.let { guideRepo.findById(it).orElse(null) }

        excursion.apply {
            title = req.title
            description = req.description
            content = req.content
            difficulty = req.difficulty
            durationDays = req.durationDays
            maxParticipants = req.maxParticipants
            price = req.price
            coverImageUrl = req.coverImageUrl
            location = req.location
            startingPoint = req.startingPoint
            this.guide = guide
            tags = req.tags.toMutableSet()
            featured = req.featured
            if (req.published && !published) publishedAt = OffsetDateTime.now()
            published = req.published
            nextDeparture = req.nextDeparture
            updatedAt = OffsetDateTime.now()
        }
        return excursionRepo.save(excursion).toDetailDto()
    }

    @Transactional
    fun delete(id: Long) {
        if (!excursionRepo.existsById(id)) throw NoSuchElementException("Izlet $id nije pronađen")
        excursionRepo.deleteById(id)
    }

    private fun generateSlug(title: String): String {
        val base = title.lowercase()
            .replace(Regex("[čć]"), "c")
            .replace(Regex("[žšđ]"), { m -> when (m.value) { "ž" -> "z"; "š" -> "s"; else -> "d" } })
            .replace(Regex("[^a-z0-9\\s-]"), "")
            .trim()
            .replace(Regex("\\s+"), "-")
        var slug = base
        var i = 1
        while (excursionRepo.findBySlugAndPublishedTrue(slug).isPresent) {
            slug = "$base-${i++}"
        }
        return slug
    }
}
