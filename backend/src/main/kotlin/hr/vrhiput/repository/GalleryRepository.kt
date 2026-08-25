package hr.vrhiput.repository

import hr.vrhiput.entity.Gallery
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query

interface GalleryRepository : JpaRepository<Gallery, Long> {
    fun findAllByOrderBySortOrderAscIdAsc(): List<Gallery>

    /** Za provjeru koristi li sliku još netko prije brisanja s R2. */
    @Query("SELECT COUNT(i) FROM GalleryImage i WHERE i.url = :url")
    fun countByUrl(url: String): Long
}
