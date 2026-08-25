package hr.vrhiput.service

import hr.vrhiput.dto.CreateGalleryRequest
import hr.vrhiput.dto.GalleryDto
import hr.vrhiput.dto.toDto
import hr.vrhiput.entity.Gallery
import hr.vrhiput.entity.GalleryImage
import hr.vrhiput.repository.GalleryRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional(readOnly = true)
class GalleryService(
    private val repo: GalleryRepository,
    private val imageCleanup: ImageCleanupService,
) {

    fun getAll(): List<GalleryDto> = repo.findAllByOrderBySortOrderAscIdAsc().map { it.toDto() }

    fun getById(id: Long): GalleryDto =
        repo.findById(id).orElseThrow { NoSuchElementException("Galerija $id nije pronađena") }.toDto()

    @Transactional
    fun create(req: CreateGalleryRequest): GalleryDto {
        val gallery = Gallery(
            title = req.title.trim(),
            description = req.description.orNull(),
            externalUrl = req.externalUrl.orNull(),
            sortOrder = repo.count().toInt(),
        )
        gallery.images = req.images.mapIndexed { i, img -> img.toEntity(gallery, i) }.toMutableList()
        return repo.save(gallery).toDto()
    }

    @Transactional
    fun update(id: Long, req: CreateGalleryRequest): GalleryDto {
        val gallery = repo.findById(id).orElseThrow { NoSuchElementException("Galerija $id nije pronađena") }
        val stareSlike = gallery.images.map { it.url }

        gallery.title = req.title.trim()
        gallery.description = req.description.orNull()
        gallery.externalUrl = req.externalUrl.orNull()

        // orphanRemoval briše uklonjene slike; lista se gradi ispočetka da
        // redoslijed odgovara onom iz forme
        gallery.images.clear()
        gallery.images.addAll(req.images.mapIndexed { i, img -> img.toEntity(gallery, i) })

        val dto = repo.save(gallery).toDto()
        repo.flush()
        imageCleanup.deleteIfUnused(stareSlike - req.images.map { it.url }.toSet())
        return dto
    }

    /** Postavlja redoslijed prema poziciji id-a u listi. */
    @Transactional
    fun reorder(ids: List<Long>) {
        val byId = repo.findAllById(ids).associateBy { it.id }
        ids.forEachIndexed { index, id -> byId[id]?.sortOrder = index }
        repo.saveAll(byId.values)
    }

    @Transactional
    fun delete(id: Long) {
        val gallery = repo.findById(id).orElseThrow { NoSuchElementException("Galerija $id nije pronađena") }
        val slike = gallery.images.map { it.url }
        repo.delete(gallery)
        repo.flush()
        imageCleanup.deleteIfUnused(slike)
    }

    private fun hr.vrhiput.dto.CreateGalleryImageRequest.toEntity(gallery: Gallery, index: Int) =
        GalleryImage(
            url = url.trim(),
            caption = caption.orNull(),
            location = location.orNull(),
            gallery = gallery,
            sortOrder = index,
        )

    private fun String?.orNull(): String? = this?.trim()?.ifBlank { null }
}
