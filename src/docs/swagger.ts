import swaggerAutogen from "swagger-autogen";

const doc = {
    info: {
      version: "v0.0.1",
      title: "Dokumentasi API BukaToko",
      description: "Dokumentasi API BukaToko",
    },
    servers: [
      {
        url: "http://localhost:3000/api",
        description: "Local Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
        },
      },
      schemas: {
        CategoryRequest: {
          name: "Aksesoris"
        },
        ProductRequest: {
          name: "Kaos Pria",
          description : "Kaos Hitam",
          images : ["https://res.cloudinary.com/drkp2wxz4/image/upload/v1724829863/samples/smile.jpg"],
          price: 20000,
          qty: 25,
          categoryId: "66e2f381abf9bf18c801c537"
        },     
        OrderRequest: {
          orderItems: [
            {
              name: "Sarung Tangan",
              productId: "66e2f36cabf9bf18c801c534", 
              price: 50000,
              quantity: 2
            },
            {
              name: "Kaos Pria",
              productId: "66e437d663948f2a24baaeb2", 
              price: 20000,
              quantity: 1
            }
          ]
        },            
        LoginRequest: {
          email: "joni2024@yopmail.com",
          password: "123412341",
        },
        RegisterRequest: {
          fullName: "joni joni",
          username: "joni2024",
          email: "joni2024@yopmail.com",
          password: "123412341",
          confirmPassword: "123412341",
        },
        UpdateProfileRequest: {
          fullName: "joni joni",
          username: "joni2024",
          email: "joni2024@yopmail.com",
          password: "123412341",
          confirmPassword: "123412341",
        },
      },
    },
  };

const outputFile = "./swagger_output.json";
const endpointsFiles = ["../routes/api.ts"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc);