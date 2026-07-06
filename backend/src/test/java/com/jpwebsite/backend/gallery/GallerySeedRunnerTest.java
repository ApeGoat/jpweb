package com.jpwebsite.backend.gallery;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class GallerySeedRunnerTest {
    @Test
    void createsHumanReadableMetadataFromSeedFilenames() {
        assertThat(GallerySeedRunner.humanize("19-2021-ase-conference-5-nov-university-students-min.jpg"))
                .isEqualTo("2021 ASE Conference 5 Nov University Students");
        assertThat(GallerySeedRunner.humanize("jp-conference-2024.jpg"))
                .isEqualTo("JP Conference 2024");
    }

    @Test
    void convertsFilenamePrefixesToStableNaturalSortOrder() {
        assertThat(GallerySeedRunner.displayOrder("2-sts.jpg")).isEqualTo(200);
        assertThat(GallerySeedRunner.displayOrder("2a-sts.jpg")).isEqualTo(201);
        assertThat(GallerySeedRunner.displayOrder("10-sts.jpg")).isEqualTo(1000);
    }
}
