package hr.vrhiput.repository

import hr.vrhiput.entity.AdminUser
import org.springframework.data.jpa.repository.JpaRepository
import java.util.Optional

interface AdminUserRepository : JpaRepository<AdminUser, Long> {
    fun findByUsername(username: String): Optional<AdminUser>
}
