package com.photodiscovery.repository;

import com.photodiscovery.model.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmailIgnoreCase(String email);

    Optional<User> findByGoogleSubject(String googleSubject);

    boolean existsByEmailIgnoreCase(String email);
}
