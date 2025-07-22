"use client"

import { Box, Button, Container, Flex, Heading, Icon, Image, Stack, Text, useColorModeValue } from "@chakra-ui/react"
import { CheckIcon, ClockIcon } from "@chakra-ui/icons"

export default function PersonalTrainerWebsitePage() {
  return (
    <Container maxW={"7xl"}>
      <Stack
        align={"center"}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 20, md: 28 }}
        direction={{ base: "column", md: "row" }}
      >
        <Stack flex={1} spacing={{ base: 5, md: 10 }}>
          <Heading lineHeight={1.1} fontWeight={600} fontSize={{ base: "3xl", sm: "4xl", lg: "6xl" }}>
            <Text
              as={"span"}
              position={"relative"}
              _after={{
                content: "''",
                width: "full",
                height: "30%",
                position: "absolute",
                bottom: 1,
                left: 0,
                bg: useColorModeValue("green.500", "green.300"),
                zIndex: -1,
              }}
            >
              Grow Your Personal Training Business
            </Text>
            <br />
            <Text as={"span"} color={"green.400"}>
              With a Stunning Website
            </Text>
          </Heading>
          <Text color={"gray.500"}>
            Attract more clients and showcase your expertise with a professional website designed specifically for
            personal trainers. Get online quickly and easily, without any technical hassle.
          </Text>
          <Stack spacing={{ base: 4, sm: 6 }} direction={{ base: "column", sm: "row" }}>
            <Button
              rounded={"full"}
              size={"lg"}
              fontWeight={"normal"}
              px={6}
              colorScheme={"green"}
              bg={"green.400"}
              _hover={{ bg: "green.500" }}
            >
              Get started
            </Button>
            <Button
              rounded={"full"}
              size={"lg"}
              fontWeight={"normal"}
              px={6}
              colorScheme={"gray"}
              bg={"gray.200"}
              _hover={{ bg: "gray.300" }}
            >
              Learn more
            </Button>
          </Stack>
        </Stack>
        <Flex flex={1} justify={"center"} align={"center"} position={"relative"} w={"full"}>
          <Box
            position={"relative"}
            height={"400px"}
            rounded={"2xl"}
            boxShadow={"2xl"}
            width={"full"}
            overflow={"hidden"}
          >
            <Image
              alt={"Hero Image"}
              fit={"cover"}
              align={"center"}
              w={"100%"}
              h={"100%"}
              src={
                "https://images.unsplash.com/photo-1552674605-db6ffd5facb5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" ||
                "/placeholder.svg"
              }
            />
          </Box>
        </Flex>
      </Stack>

      <Stack align={"center"} spacing={{ base: 8, md: 10 }} py={{ base: 20, md: 28 }}>
        <Heading
          textAlign={"center"}
          lineHeight={1.1}
          fontWeight={600}
          fontSize={{ base: "3xl", sm: "4xl", lg: "5xl" }}
        >
          Key Features
        </Heading>

        <Flex direction={{ base: "column", md: "row" }} justify={"space-around"} align={"center"} w={"full"}>
          <Stack align={"center"} spacing={2}>
            <Icon as={CheckIcon} color={"green.500"} boxSize={8} />
            <Text fontWeight={"bold"}>Easy to Use</Text>
            <Text color={"gray.500"} textAlign={"center"}>
              Simple and intuitive interface for effortless website management.
            </Text>
          </Stack>

          <Stack align={"center"} spacing={2}>
            <Icon as={ClockIcon} color={"green.500"} boxSize={8} />
            <Text fontWeight={"bold"}>Super fast</Text>
            <Text color={"gray.500"} textAlign={"center"}>
              Launch your website in minutes with our streamlined setup process.
            </Text>
          </Stack>

          <Stack align={"center"} spacing={2}>
            <Icon as={CheckIcon} color={"green.500"} boxSize={8} />
            <Text fontWeight={"bold"}>Mobile-Friendly</Text>
            <Text color={"gray.500"} textAlign={"center"}>
              Fully responsive design ensures your website looks great on any device.
            </Text>
          </Stack>
        </Flex>
      </Stack>
    </Container>
  )
}
