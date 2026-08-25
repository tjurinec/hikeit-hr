package hr.vrhiput.repository

import hr.vrhiput.entity.SiteSettings
import org.springframework.data.jpa.repository.JpaRepository

interface SiteSettingsRepository : JpaRepository<SiteSettings, Long>
