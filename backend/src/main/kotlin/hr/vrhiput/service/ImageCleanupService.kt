package hr.vrhiput.service

import hr.vrhiput.repository.ExcursionRepository
import hr.vrhiput.repository.GalleryRepository
import hr.vrhiput.repository.GuideRepository
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

/**
 * Uklanja slike s R2 kad ih više nitko ne koristi.
 *
 * Provjera referenci je namjerna: isti URL može stajati na više zapisa (npr.
 * ručno upisan u polje "ili upiši URL slike"), a brisanje je nepovratno.
 * Uvijek se poziva NAKON što je zapis u bazi već promijenjen ili obrisan,
 * inače bi taj isti zapis još uvijek brojao kao referenca.
 */
@Service
class ImageCleanupService(
    private val uploadService: ImageUploadService,
    private val excursionRepo: ExcursionRepository,
    private val galleryRepo: GalleryRepository,
    private val guideRepo: GuideRepository,
) {
    private val log = LoggerFactory.getLogger(javaClass)

    fun deleteIfUnused(url: String?) {
        if (url.isNullOrBlank() || isReferenced(url)) return
        try {
            uploadService.delete(url)
        } catch (e: Exception) {
            // Neuspjelo brisanje ostavlja orphan na R2, ali ne smije srušiti operaciju
            log.warn("Ne mogu obrisati sliku $url s R2: ${e.message}")
        }
    }

    fun deleteIfUnused(urls: Collection<String?>) = urls.forEach { deleteIfUnused(it) }

    private fun isReferenced(url: String): Boolean =
        excursionRepo.countByCoverImageUrl(url) > 0 ||
            excursionRepo.countImagesByUrl(url) > 0 ||
            galleryRepo.countByUrl(url) > 0 ||
            guideRepo.countByAvatarUrl(url) > 0
}
