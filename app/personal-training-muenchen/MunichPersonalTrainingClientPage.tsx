import { Badge, Button, Card, Container, Grid, Text } from "@nextui-org/react"
import Image from "next/image"

const MunichPersonalTrainingClientPage = () => {
  return (
    <Container>
      <Grid.Container gap={2} justify="center">
        <Grid xs={12} lg={6}>
          <Card>
            <Card.Body>
              <Text h1>Personal Training in München</Text>
              <Badge
                color="juice"
                variant="flat"
                css={{ bg: "$juice/10", text: "$juice", border: "$juice/50", font: "$semibold" }}
              >
                München
              </Badge>
              <Text>
                Our personal training programs in München are designed to help you achieve your fitness goals. Whether
                you're looking to lose weight, build muscle, or improve your overall health, we have a plan for you.
              </Text>
            </Card.Body>
          </Card>
        </Grid>
        <Grid xs={12} lg={6}>
          <Card>
            <Card.Body>
              <Text h1>Two ways to one goal</Text>
              <Grid.Container gap={2} css={{ maxWidth: "6xl" }}>
                <Grid xs={12} lg={6}>
                  <Card css={{ h: "full" }}>
                    <Card.Body>
                      <Text>Personalized training sessions tailored to your specific needs and goals.</Text>
                    </Card.Body>
                  </Card>
                </Grid>
                <Grid xs={12} lg={6}>
                  <Card css={{ h: "full" }}>
                    <Card.Body>
                      <Text>Access to our state-of-the-art gym facilities and equipment.</Text>
                    </Card.Body>
                  </Card>
                </Grid>
              </Grid.Container>
            </Card.Body>
          </Card>
        </Grid>
      </Grid.Container>
      <Button
        css={{
          position: "fixed",
          bottom: "6",
          right: "6",
          zIndex: "50",
          bg: "$juice",
          hover: { bg: "$juice/90" },
          text: "$black",
          font: "$bold",
          px: "6",
          py: "3",
          rounded: "$full",
          shadow: "$lg",
          hover: { shadow: "$xl" },
          transition: "$all $300",
          flexDirection: "row",
          alignItems: "center",
          gap: "2",
          text: "$sm",
          md: { text: "$base", px: "6", py: "3" },
        }}
      >
        <Image src="/download-icon.svg" alt="Download Icon" width={24} height={24} />
        App downloaden
      </Button>
    </Container>
  )
}

export default MunichPersonalTrainingClientPage
