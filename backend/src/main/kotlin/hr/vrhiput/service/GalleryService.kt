package hr.vrhiput.service

import hr.vrhiput.dto.GalleryImageDto
import hr.vrhiput.dto.toDto
import hr.vrhiput.repository.GalleryRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional(readOnly = true)
class GalleryService(private val repo: GalleryRepository) {

    fun getAll(): List<GalleryImageDto> =
        repo.findAllByOrderBySortOrderAsc().map { it.toDto() }

    fun getByCategory(category: String): List<GalleryImageDto> =
        repo.findAllByCategoryOrderBySortOrderAsc(category).map { it.toDto() }
}
