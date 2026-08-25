package hr.vrhiput.config

import hr.vrhiput.repository.AdminUserRepository
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.Customizer
import org.springframework.http.HttpMethod
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.SecurityFilterChain

@Configuration
@EnableWebSecurity
class SecurityConfig {

    @Bean
    fun passwordEncoder(): PasswordEncoder = BCryptPasswordEncoder()

    @Bean
    fun userDetailsService(repo: AdminUserRepository): UserDetailsService =
        UserDetailsService { username ->
            val admin = repo.findByUsername(username)
                .orElseThrow { UsernameNotFoundException("Korisnik '$username' nije pronađen") }
            User.withUsername(admin.username)
                .password(admin.password)
                .roles("ADMIN")
                .build()
        }

    @Bean
    fun filterChain(http: HttpSecurity): SecurityFilterChain {
        http
            // CORS mora ici kroz Security chain, inace preflight (OPTIONS bez
            // Authorization headera) padne na 401 prije nego CorsFilter dode na red
            .cors(Customizer.withDefaults())
            .csrf { it.disable() }
            .sessionManagement { it.sessionCreationPolicy(SessionCreationPolicy.STATELESS) }
            .authorizeHttpRequests { auth ->
                // Admin GET rute moraju doći prije javnog permitAll — prvi match pobjeđuje
                auth.requestMatchers(HttpMethod.GET, "/api/excursions/admin/**").hasRole("ADMIN")
                // Javni GET endpointi
                auth.requestMatchers(HttpMethod.GET, "/api/excursions/**").permitAll()
                auth.requestMatchers(HttpMethod.GET, "/api/gallery/**").permitAll()
                auth.requestMatchers(HttpMethod.GET, "/api/guides/**").permitAll()
                // Kontakt forma: slanje je javno, čitanje poruka samo za admina
                auth.requestMatchers(HttpMethod.POST, "/api/contact").permitAll()
                auth.requestMatchers("/api/contact/**").hasRole("ADMIN")
                auth.requestMatchers("/api/upload/**").hasRole("ADMIN")
                // Admin endpointi — zahtijevaju Basic Auth
                auth.requestMatchers(HttpMethod.POST, "/api/excursions/**").hasRole("ADMIN")
                auth.requestMatchers(HttpMethod.PUT, "/api/excursions/**").hasRole("ADMIN")
                auth.requestMatchers(HttpMethod.DELETE, "/api/excursions/**").hasRole("ADMIN")
                auth.requestMatchers(HttpMethod.POST, "/api/gallery/**").hasRole("ADMIN")
                auth.requestMatchers(HttpMethod.PUT, "/api/gallery/**").hasRole("ADMIN")
                auth.requestMatchers(HttpMethod.DELETE, "/api/gallery/**").hasRole("ADMIN")
                auth.requestMatchers(HttpMethod.POST, "/api/guides/**").hasRole("ADMIN")
                auth.requestMatchers(HttpMethod.PUT, "/api/guides/**").hasRole("ADMIN")
                auth.requestMatchers(HttpMethod.DELETE, "/api/guides/**").hasRole("ADMIN")
                auth.anyRequest().authenticated()
            }
            .httpBasic { }
        return http.build()
    }
}
