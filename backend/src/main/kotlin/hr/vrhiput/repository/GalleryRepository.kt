package hr.vrhiput.repository

import hr.vrhiput.entity.GalleryImage
import org.springframework.data.jpa.repository.JpaRepository

interface GalleryRepository : JpaRepository<GalleryImage, Long> {
    fun findAllByOrderBySortOrderAsc(): List<GalleryImage>
    fun findAllByCategoryOrderBySortOrderAsc(category: String): List<GalleryImage>
}
