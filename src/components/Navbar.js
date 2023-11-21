import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    HStack,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    useDisclosure,
    useToast,
    VStack,
  } from "@chakra-ui/react";
  import Link from "next/link";
  import { useRouter } from "next/router";
  import { useState, useEffect } from "react";
  import { loginUser } from "@/utils/fetch";
  const Navbar = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isLogin, setIsLogin] = useState(false);
    const toast = useToast();
    const router = useRouter();
  
    useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (token) {
      setIsLogin(true);
    }
  }, []);
  
    return (
      <Flex
        w="full"
        as="nav"
        align="center"
        justify="space-between"
        wrap="wrap"
        padding="1rem"
        bg="gray.600"
        color="white"
      >
        <Link href="/">
          <Flex align="center" mr={5} cursor="pointer">
            <Text
              fontSize="xl"
              fontWeight="bold"
              color={"white"}
              _hover={{ marginBottom: "5px", transition: "all 0.2s ease" }}
            >
              Books App
            </Text>
          </Flex>
        </Link>
        <HStack>
          {isLogin && (
            <Link href={"/books/add"}>
              <Button colorScheme={'green'}>
                Add New Book
              </Button>
            </Link>
          )}
          {!isLogin ? (
            <Button onClick={onOpen} colorScheme={'blue'}>
              Login
            </Button>
          ) : (
            <Button colorScheme={'red'} onClick={() => {
              window.localStorage.removeItem('token');
              setIsLogin(false);
              router.push('/');
            }}>
              Logout
            </Button>
          )}
        </HStack>
  
  
        <Modal isOpen={isOpen} onClose={onClose}>
          <form
            id="login-form"
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                const token = await loginUser(
                  e.target.email.value,
                  e.target.password.value
                );
                window.localStorage.setItem("token", token.token);
                setIsLogin(true);
                router.push("/");
                onClose();
              } catch (err) {
                toast({
                  title: "Error",
                  description: err.message,
                  status: "error",
                  duration: 3000,
                  isClosable: true,
                });
              }
            }}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Login</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <VStack>
                  <FormControl isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input
                      name="email"
                      type="email"
                      placeholder="Enter your email address"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Password</FormLabel>
                    <Input
                      type="password"
                      name="password"
                      placeholder="Enter your password"
                    />
                  </FormControl>
                </VStack>
              </ModalBody>
              <ModalFooter>
                <Button type="submit" form="login-form" colorScheme="blue" mr={3}>
                  Login
                </Button>
                <Link href="/register" onClick={onClose}>
                  <Button variant="ghost">
                    Doesnt Have Account? Click here
                  </Button>
                </Link>
              </ModalFooter>
            </ModalContent>
          </form>
        </Modal>
      </Flex >
    );
  };
  
  export default Navbar;