package hr.vrhiput.repository

import hr.vrhiput.entity.Excursion
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.util.Optional

interface ExcursionRepository : JpaRepository<Excursion, Long> {
    fun findBySlugAndPublishedTrue(slug: String): Optional<Excursion>
    fun findAllByPublishedTrueOrderByPublishedAtDesc(): List<Excursion>
    fun findAllByPublishedTrueAndFeaturedTrueOrderByPublishedAtDesc(): List<Excursion>

    @Query("""
        SELECT e FROM Excursion e
        WHERE e.published = true
        AND (
            LOWER(e.title) LIKE LOWER(CONCAT('%', :query, '%'))
            OR LOWER(e.location) LIKE LOWER(CONCAT('%', :query, '%'))
        )
        ORDER BY e.publishedAt DESC
    """)
    fun search(query: String): List<Excursion>
}
