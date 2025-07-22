"use client"
import { Box, Container, Typography, Grid, Button, styled, keyframes } from "@mui/material"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import DevicesIcon from "@mui/icons-material/Devices"
import { useTheme } from "@mui/material/styles"
import useMediaQuery from "@mui/material/useMediaQuery"

const HeroContainer = styled(Box)(({ theme }) => ({
  background: "linear-gradient(45deg, #2196F3 30%, #3F51B5 90%)",
  color: theme.palette.common.white,
  padding: theme.spacing(8, 0),
  textAlign: "center",
}))

const FeatureGrid = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(4, 0),
}))

const FeatureItem = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  height: "100%", // Ensure equal height for all feature items
}))

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
`

const AnimatedButton = styled(Button)(({ theme }) => ({
  animation: `${pulse} 2s infinite`,
}))

const PersonalTrainerWebsitePage = () => {
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"))

  return (
    <Box>
      <HeroContainer>
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom>
            Launch Your Personal Trainer Website Today!
          </Typography>
          <Typography variant="h5" paragraph>
            Attract more clients and grow your business with a professional online presence.
          </Typography>
          <AnimatedButton variant="contained" color="secondary" size="large">
            Get Started Now
          </AnimatedButton>
        </Container>
      </HeroContainer>

      <Container maxWidth="lg">
        <FeatureGrid container spacing={4}>
          <Grid item xs={12} md={4}>
            <FeatureItem>
              <CheckCircleIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                Easy Setup
              </Typography>
              <Typography variant="body2" align="center">
                Get your website up and running in minutes with our intuitive platform.
              </Typography>
            </FeatureItem>
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureItem>
              <AccessTimeIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                Super fast
              </Typography>
              <Typography variant="body2" align="center">
                Blazing fast loading times to keep your clients engaged.
              </Typography>
            </FeatureItem>
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureItem>
              <DevicesIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                Mobile Responsive
              </Typography>
              <Typography variant="body2" align="center">
                Your website will look great on any device, from smartphones to desktops.
              </Typography>
            </FeatureItem>
          </Grid>
        </FeatureGrid>

        <Box py={4} textAlign="center">
          <Typography variant="h4" gutterBottom>
            Ready to take your personal training business to the next level?
          </Typography>
          <Button variant="contained" color="primary" size="large">
            Create Your Website
          </Button>
        </Box>
      </Container>
    </Box>
  )
}

export default PersonalTrainerWebsitePage
