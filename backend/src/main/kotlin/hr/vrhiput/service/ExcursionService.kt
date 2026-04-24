package hr.vrhiput.service

import hr.vrhiput.dto.ExcursionDetailDto
import hr.vrhiput.dto.ExcursionSummaryDto
import hr.vrhiput.dto.toDetailDto
import hr.vrhiput.dto.toSummaryDto
import hr.vrhiput.repository.ExcursionRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional(readOnly = true)
class ExcursionService(private val repo: ExcursionRepository) {

    fun getAll(): List<ExcursionSummaryDto> =
        repo.findAllByPublishedTrueOrderByPublishedAtDesc().map { it.toSummaryDto() }

    fun getFeatured(): List<ExcursionSummaryDto> =
        repo.findAllByPublishedTrueAndFeaturedTrueOrderByPublishedAtDesc().map { it.toSummaryDto() }

    fun getBySlug(slug: String): ExcursionDetailDto =
        repo.findBySlugAndPublishedTrue(slug)
            .orElseThrow { NoSuchElementException("Izlet '$slug' nije pronađen") }
            .toDetailDto()

    fun search(query: String): List<ExcursionSummaryDto> =
        repo.search(query).map { it.toSummaryDto() }
}
