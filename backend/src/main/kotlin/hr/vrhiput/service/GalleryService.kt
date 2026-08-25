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
        image.apply {
            url = req.url
            caption = req.caption
            location = req.location
            category = req.category
            excursion = req.excursionId?.let { excursionRepo.findById(it).orElse(null) }
            sortOrder = req.sortOrder
        }
        return repo.save(image).toDto()
    }

    @Transactional
    fun delete(id: Long) {
        if (!repo.existsById(id)) throw NoSuchElementException("Slika $id nije pronađena")
        repo.deleteById(id)
    }
}
