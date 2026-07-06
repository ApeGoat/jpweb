package com.jpwebsite.backend.gallery;

import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.Comparator;
import java.util.Locale;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.ResourcePatternResolver;
import org.springframework.http.MediaTypeFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
@ConditionalOnProperty(name = "app.gallery-seed.enabled", havingValue = "true")
public class GallerySeedRunner implements ApplicationRunner {
    private static final Logger logger = LoggerFactory.getLogger(GallerySeedRunner.class);
    private static final String SEED_PATTERN = "classpath*:seed/gallery/*";
    private static final Pattern ORDER_PREFIX = Pattern.compile("^(\\d+)([a-z]?)-", Pattern.CASE_INSENSITIVE);
    private static final Set<String> ACRONYMS = Set.of("ase", "bc", "capcom", "cd", "csa", "glex", "iss", "jp", "jsc", "ms", "nasa", "nbl", "nr", "rms", "spacex", "sts");

    private final ResourcePatternResolver resources;
    private final GalleryImageService galleryService;

    public GallerySeedRunner(ResourcePatternResolver resources, GalleryImageService galleryService) {
        this.resources = resources;
        this.galleryService = galleryService;
    }

    @Override
    public void run(ApplicationArguments args) throws IOException {
        Resource[] images = resources.getResources(SEED_PATTERN);
        Arrays.sort(images, Comparator
                .comparingInt((Resource resource) -> displayOrder(filename(resource)))
                .thenComparing(resource -> filename(resource).toLowerCase(Locale.ROOT)));

        int created = 0;
        int skipped = 0;
        for (Resource image : images) {
            String filename = filename(image);
            String contentType = MediaTypeFactory.getMediaType(filename)
                    .filter(type -> "image".equals(type.getType()))
                    .orElseThrow(() -> new IllegalArgumentException("Unsupported gallery seed file: " + filename))
                    .toString();
            String caption = humanize(filename);
            boolean wasCreated;
            try (InputStream input = image.getInputStream()) {
                wasCreated = galleryService.seed(
                        filename, contentType, input.readAllBytes(), caption, displayOrder(filename));
            }
            if (wasCreated) {
                created++;
            } else {
                skipped++;
            }
        }

        logger.info("Gallery seed complete: {} created, {} already present", created, skipped);
    }

    static String humanize(String filename) {
        String name = StringUtils.stripFilenameExtension(filename);
        name = ORDER_PREFIX.matcher(name).replaceFirst("");
        name = name.replaceAll("(?i)-(min|scaled)$", "");

        return Arrays.stream(name.split("[-_]+"))
                .filter(StringUtils::hasText)
                .map(GallerySeedRunner::titleCase)
                .reduce((left, right) -> left + " " + right)
                .orElse("Gallery Image");
    }

    static int displayOrder(String filename) {
        Matcher matcher = ORDER_PREFIX.matcher(filename);
        if (!matcher.find()) {
            return Integer.MAX_VALUE;
        }
        int order = Integer.parseInt(matcher.group(1)) * 100;
        if (!matcher.group(2).isEmpty()) {
            order += Character.toLowerCase(matcher.group(2).charAt(0)) - 'a' + 1;
        }
        return order;
    }

    private static String titleCase(String token) {
        String lower = token.toLowerCase(Locale.ROOT);
        if (ACRONYMS.contains(lower)) {
            return lower.toUpperCase(Locale.ROOT);
        }
        return Character.toUpperCase(lower.charAt(0)) + lower.substring(1);
    }

    private static String filename(Resource resource) {
        String filename = resource.getFilename();
        if (!StringUtils.hasText(filename)) {
            throw new IllegalArgumentException("Gallery seed resource has no filename: " + resource);
        }
        return filename;
    }
}
