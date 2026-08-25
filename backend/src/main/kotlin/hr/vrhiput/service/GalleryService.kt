package hr.vrhiput.service

import hr.vrhiput.dto.CreateGalleryImageRequest
import hr.vrhiput.dto.GalleryImageDto
import hr.vrhiput.dto.toDto
import hr.vrhiput.entity.GalleryImage
import hr.vrhiput.repository.ExcursionRepository
import hr.vrhiput.repository.GalleryRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional(readOnly = true)
class GalleryService(
    private val repo: GalleryRepository,
    private val excursionRepo: ExcursionRepository,
    private val imageCleanup: ImageCleanupService,
) {

    fun getAll(): List<GalleryImageDto> =
        repo.findAllByOrderBySortOrderAsc().map { it.toDto() }

    fun getByCategory(category: String): List<GalleryImageDto> =
        repo.findAllByCategoryOrderBySortOrderAsc(category).map { it.toDto() }

    @Transactional
    fun create(req: CreateGalleryImageRequest): GalleryImageDto =
        repo.save(
            GalleryImage(
                url = req.url,
                caption = req.caption,
                location = req.location,
                category = req.category,
                excursion = req.excursionId?.let { excursionRepo.findById(it).orElse(null) },
                sortOrder = req.sortOrder,
            )
        ).toDto()

    @Transactional
    fun update(id: Long, req: CreateGalleryImageRequest): GalleryImageDto {
        val image = repo.findById(id).orElseThrow { NoSuchElementException("Slika $id nije pronađena") }
        val stariUrl = image.url
        image.apply {
            url = req.url
            caption = req.caption
            location = req.location
            category = req.category
            excursion = req.excursionId?.let { excursionRepo.findById(it).orElse(null) }
            sortOrder = req.sortOrder
        }
        val dto = repo.save(image).toDto()
        repo.flush()
        if (stariUrl != req.url) imageCleanup.deleteIfUnused(stariUrl)
        return dto
    }

    @Transactional
    fun delete(id: Long) {
        val image = repo.findById(id).orElseThrow { NoSuchElementException("Slika $id nije pronađena") }
        val url = image.url
        repo.delete(image)
        repo.flush()
        imageCleanup.deleteIfUnused(url)
    }
}
