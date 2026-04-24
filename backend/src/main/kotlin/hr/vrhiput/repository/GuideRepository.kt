package hr.vrhiput.repository

import hr.vrhiput.entity.Guide
import org.springframework.data.jpa.repository.JpaRepository

interface GuideRepository : JpaRepository<Guide, Long>
