Cara eksekusi program projek ini

1. pastikan data url mongodb anda benar dan ip pada mongodb terkoneksi
2. pastikan juga data cloudinary anda benar untuk upload file ke akun cloudinary anda
3. lakukan npx ts-node secret.ts pada terminal, untuk mendapatkan SECRET, lalu masukan kode tersebut ke .env pada bagian SECRET

4. npm run docs, untuk melakukan API documentation swagger UI
5. npm run index, untuk memulai server
6. buka http://localhost:3000/docs pada browser anda, API Documentation

buka postman

CATEGORIES
* add request pada postman, lalu copy path http://localhost:3000/api/categories
- gunakan POST untuk mendaftarkan kategori baru, dengan isi body, contoh:
{
    "name": "Pakaian"
}
SEND
- gunakan GET untuk melihat kategori yang ada, SEND
- gunakan GET tambahkan Id pada path untuk melihat kategori tertentu, contoh : http://localhost:3000/api/categories/66e2f381abf9bf18c801c537, SEND
- gunakan PUT untuk mengubah isi/nama kategori, tambahkan Id pada path yang ingin diubah, contoh : http://localhost:3000/api/categories/66e2f381abf9bf18c801c537
isi pada bagian body dengan nama kategori baru, contoh :
{
    "name": "Perhiasan"
} 
SEND
- gunakan DELETE untuk menghapus kategori, tambahkan Id yang ingin di hapus, SEND

PRODUCTS
* add request pada postman, lalu copy path http://localhost:3000/api/products/
- gunakan POST untuk mendaftarkan produk baru, dengan isi body, isi categoryId sesuai Id kategori yang ingin isi contoh:
{
    "name": "Kemeja Pria",
    "description" : "Kemeja Hitam",
    "images" : ["https://res.cloudinary.com/drkp2wxz4/image/upload/v1724829863/samples/smile.jpg"],
    "price": 100000,
    "qty": 15,
    "categoryId": "66e2f381abf9bf18c801c537"   // ini contoh Id kategori pakaian
}
SEND
- gunakan GET untuk melihat semua produk yang ada, SEND
- gunakan GET tambahkan Id produk pada path untuk melihat kategori tertentu, contoh : http://localhost:3000/api/products/66e2f3c2abf9bf18c801c53a, SEND
- gunakan PUT untuk mengubah isi/nama produk, tambahkan Id pada path yang ingin diubah, contoh : http://localhost:3000/api/products/66e2f3c2abf9bf18c801c53a
isi pada bagian body dengan nama produk baru, contoh :
{
    "name": "Kemeja Wanita",
    "description" : "Kemeja Putih",
    "images" : ["https://res.cloudinary.com/drkp2wxz4/image/upload/v1724829863/samples/smile.jpg"],
    "price": 100000,
    "qty": 20,
    "categoryId": "66e2f381abf9bf18c801c537"
}
SEND
- gunakan DELETE untuk menghapus produk, tambahkan Id yang ingin di hapus, SEND

MEDIA/UPLOAD
* add request pada postman, gunakan POST pada path http://localhost:3000/upload/single untuk upload 1 file/image
- pilih tab body dan form-data
- masukkan key : 'file'. lalu masukkan file yang ingin di upload... send
* gunakan method POST dan gunakan path http://localhost:3000/upload/multiple untuk upload lebih dari 1 file/image, max 10
- pilih tab body dan form-data
- masukkan key : 'files'. lalu masukkan beberapa file yang ingin di upload... send

AUTHENTICATION
* add request, gunakan POST pada path http://localhost:3000/api/auth/register untuk register
- isi body untuk register akun, contoh :
{ 
  "email": "sander@toko.com", 
  "fullName": "Sander",
  "password": "12341234",
  "username": "sander",
  "roles": ["user"]  // hanya bisa user atau admin
}
SEND
* add request, gunakan POST pada path http://localhost:3000/api/auth/login untuk login akun yang sudah register
- isi data pada tab body, pilih raw, JSON. isi data yang register tadi. contoh:
{
  "email": "sander@toko.com",
  "password": "12341234"
}
SEND
- copy isi "data". untuk menjadi token jwt login nanti
* add request, gunakan GET pada path http://localhost:3000/api/auth/me untuk melakukan autentikasi
- pilih tab headers, isi key dengan "Authorization", dan value "Bearer <paste token login yang tadi>"
SEND
- data akan keluar untuk admin
{
    "message": "success fetch user profile",
    "data": {
        "_id": "66d834e12f669b2036b7caa1",
        "fullName": "Admin",
        "username": "admintoko",
        "email": "admin@toko.com",
        "roles": [
            "admin"
        ],
        "profilePicture": "user.jpg",
        "createdAt": "2024-09-04T10:22:25.270Z",
        "updatedAt": "2024-09-04T10:22:25.270Z",
        "__v": 0
    }
}
- jika anda login dengan akun yang memiliki role sebagai "user", maka output yang akan keluar:
{
    "message": "You are a User"
}


ORDERS
* add request, gunakan POST pada path http://localhost:3000/api/orders untuk melakukan order
- pilih tab headers, isi key dengan "Authorization", dan value "Bearer <paste token login yang tadi>"
- isi tab body yang anda ingin order, contoh :
{
  "orderItems": [
    {
      "name": "Sarung Tangan",
      "productId": "66e2f36cabf9bf18c801c534", 
      "price": 50000,
      "quantity": 2
    }
  ]
}
SEND
// orderItems berbentuk array, jadi bisa order produk yang berbeda-beda dalam 1x order
- jika berhasil, data akan keluar:
{
    "message": "Order created successfully",
    "data": {
        "grandTotal": 100000,  // sudah ditotalkan semua pembelian
        "orderItems": [
            {
                "name": "Sarung Tangan",
                "productId": "66e2f36cabf9bf18c801c534",
                "price": 50000,
                "quantity": 2,
                "_id": "66e322c8c84edb17af3c8ab2"
            }
        ],
        "createdBy": "66e322479a5af37dfb2f140a",  // Id pembeli
        "status": "pending",  // secara default akan pending. tapi bisa memilih manual ("completed" atau "cancelled")
        "_id": "66e322c8c84edb17af3c8ab1",
        "createdAt": "2024-09-12T17:20:08.177Z",
        "updatedAt": "2024-09-12T17:20:08.177Z",
        "__v": 0,
        "createdByName": "Sander2"
    }
}

* add request, gunakan GET pada path http://localhost:3000/api/orders untuk melihat order setelah melakukan order tadi
- pilih tab headers, isi key dengan "Authorization", dan value "Bearer <paste token login yang tadi>"
SEND
- contoh data akan keluar :
{
    "message": "Orders retrieved successfully",
    "data": [
        {
            "_id": "66e322c8c84edb17af3c8ab1",
            "grandTotal": 100000,
            "orderItems": [
                {
                    "name": "Sarung Tangan",
                    "productId": "66e2f36cabf9bf18c801c534",
                    "price": 50000,
                    "quantity": 2,
                    "_id": "66e322c8c84edb17af3c8ab2"
                }
            ],
            "createdBy": "66e322479a5af37dfb2f140a",
            "status": "pending",
            "createdAt": "2024-09-12T17:20:08.177Z",
            "updatedAt": "2024-09-12T17:20:08.177Z",
            "__v": 0
        }
    ]
}


* bisa cek produk pada bagian GET /products untuk melihat produk kembali
* barang akan berkurang sesuai yang sudah diorder

CATATAN, untuk mendapat invoice order pada email anda
- register menggunakan email aktif anda
- lakukan login dengan email aktif anda
- lakukan order seperti cara diatas
invoice order anda akan dikirimkan ke email akun login anda

CTRL + C untuk mematikan server


Sander,
Sanbercode Backend Nodejs
