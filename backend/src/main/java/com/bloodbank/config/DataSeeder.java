package com.bloodbank.config;

import com.bloodbank.entity.BloodRequest;
import com.bloodbank.entity.BloodUnit;
import com.bloodbank.entity.Donation;
import com.bloodbank.entity.User;
import com.bloodbank.repository.BloodRequestRepository;
import com.bloodbank.repository.BloodUnitRepository;
import com.bloodbank.repository.DonationRepository;
import com.bloodbank.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BloodUnitRepository bloodUnitRepository;

    @Autowired
    private BloodRequestRepository bloodRequestRepository;

    @Autowired
    private DonationRepository donationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private static final String[] BLOOD_GROUPS = {"A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"};
    private static final String[] COMPONENTS = {"Whole Blood", "RBC", "Platelets", "Plasma"};
    private static final String[] URGENCIES = {"Normal", "Urgent", "Critical"};
    private static final String[] STATUSES = {"PENDING", "APPROVED", "FULFILLED", "REJECTED"};

    @Override
    public void run(String... args) throws Exception {
        System.out.println("=== Apheresis DataSeeder: Checking Database ===");
        Random random = new Random();

        // ---------------------------------------------------------------
        // 1. Always seed a dedicated dummy donor user so requests/donations
        //    can be created regardless of what role "Anshuma" (or any real
        //    user) has registered with.
        // ---------------------------------------------------------------
        User dummyDonor;
        var existingDummy = userRepository.findByUsername("donor_demo");
        if (existingDummy.isEmpty()) {
            System.out.println("Creating demo donor account...");
            User u = new User();
            u.setUsername("donor_demo");
            u.setPassword(passwordEncoder.encode("donor123"));
            u.setEmail("donor_demo@apheresis.com");
            u.setRole("ROLE_USER");
            u.setBloodGroup("B+");
            u.setBmi(23.0);
            u.setHaemoglobin(13.8);
            dummyDonor = userRepository.save(u);
        } else {
            dummyDonor = existingDummy.get();
        }

        // Also attach requests/donations to any REAL user accounts found
        List<User> allDonors = userRepository.findAll().stream()
                .filter(u -> "ROLE_USER".equals(u.getRole()))
                .toList();

        // ---------------------------------------------------------------
        // 2. Seed Blood Units (35 bags across all blood groups)
        // ---------------------------------------------------------------
        if (bloodUnitRepository.count() == 0) {
            System.out.println("Seeding 35 blood units...");
            for (int i = 0; i < 35; i++) {
                BloodUnit unit = new BloodUnit();
                unit.setBloodGroup(BLOOD_GROUPS[random.nextInt(BLOOD_GROUPS.length)]);
                unit.setBloodComponentType(COMPONENTS[random.nextInt(COMPONENTS.length)]);
                unit.setUnits(1);

                LocalDate collectionDate = LocalDate.now().minusDays(random.nextInt(20));
                unit.setCollectionDate(collectionDate);
                unit.setExpiryDate(collectionDate.plusDays(42));

                // ~10% chance of already being expired for realism
                if (random.nextInt(10) == 0) {
                    unit.setStatus("EXPIRED");
                    unit.setExpiryDate(LocalDate.now().minusDays(1));
                } else {
                    unit.setStatus("AVAILABLE");
                }
                bloodUnitRepository.save(unit);
            }
            System.out.println("Blood units seeded.");
        }

        // ---------------------------------------------------------------
        // 3. Seed Blood Requests (attached to dummyDonor + all real donors)
        // ---------------------------------------------------------------
        if (bloodRequestRepository.count() == 0) {
            System.out.println("Seeding blood requests...");

            // 12 requests for the demo donor
            for (int i = 0; i < 12; i++) {
                bloodRequestRepository.save(buildRequest(dummyDonor, i, random));
            }

            // 3 requests for each real user account
            for (User u : allDonors) {
                for (int i = 0; i < 3; i++) {
                    bloodRequestRepository.save(buildRequest(u, i, random));
                }
            }
            System.out.println("Blood requests seeded.");
        }

        // ---------------------------------------------------------------
        // 4. Seed Donations (attached to dummyDonor + all real donors)
        // ---------------------------------------------------------------
        if (donationRepository.count() == 0) {
            System.out.println("Seeding donations...");

            for (int i = 1; i <= 3; i++) {
                donationRepository.save(buildDonation(dummyDonor, i));
            }

            for (User u : allDonors) {
                for (int i = 1; i <= 3; i++) {
                    donationRepository.save(buildDonation(u, i));
                }
            }
            System.out.println("Donations seeded.");
        }

        System.out.println("=== DataSeeder Complete ===");
    }

    private BloodRequest buildRequest(User user, int index, Random random) {
        BloodRequest req = new BloodRequest();
        req.setRequester(user);
        req.setBloodGroup(BLOOD_GROUPS[random.nextInt(BLOOD_GROUPS.length)]);
        req.setBloodComponentType(COMPONENTS[random.nextInt(COMPONENTS.length)]);
        req.setQuantityUnits(random.nextInt(4) + 1);
        req.setUrgency(URGENCIES[random.nextInt(URGENCIES.length)]);
        // First few always PENDING so the admin always has actionable items
        req.setStatus(index < 4 ? "PENDING" : STATUSES[random.nextInt(STATUSES.length)]);
        req.setRequestDate(LocalDateTime.now().minusDays(random.nextInt(10)).minusHours(random.nextInt(24)));
        return req;
    }

    private Donation buildDonation(User user, int monthsAgo) {
        Donation d = new Donation();
        d.setDonor(user);
        d.setBloodGroup(user.getBloodGroup() != null ? user.getBloodGroup() : "O+");
        d.setBloodComponentType("Whole Blood");
        d.setUnits(1);
        d.setQuantityMl(450);
        LocalDate donationDate = LocalDate.now().minusMonths((long) monthsAgo * 4);
        d.setDonationDate(donationDate);
        d.setNextEligibleDate(donationDate.plusDays(90));
        return d;
    }
}
