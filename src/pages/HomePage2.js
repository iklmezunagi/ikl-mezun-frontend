// // src/pages/Homepage2.js
// import React, { useEffect, useState } from 'react';
// import Navbar from '../components/Navbar';
// import { getCurrentUserByUsername, getAllPostsPaged } from '../services/HomeService'; // Servis fonksiyonlarını kullanıyoruz

// function Homepage2() {
//   const [currentUser, setCurrentUser] = useState({
//     firstName: '',
//     lastName: '',
//     profession: '',
//     city: '',
//     bio: '',
//   });
//   const [userLoading, setUserLoading] = useState(true);
//   const [userError, setUserError] = useState('');

//   const [posts, setPosts] = useState([]);
//   const [postsLoading, setPostsLoading] = useState(true);
//   const [postsError, setPostsError] = useState('');

//   useEffect(() => {
//     console.log('Homepage2 mount edildi.');

//     const token = localStorage.getItem('token');
//     const username = localStorage.getItem('username');

//     console.log('localStorage token:', token);
//     console.log('localStorage username:', username);

//     if (!token || !username) {
//       const msg = 'Token veya kullanıcı adı bulunamadı!';
//       console.error(msg);
//       setUserError(msg);
//       setUserLoading(false);
//       setPostsLoading(false);
//       return;
//     }

//     // Kullanıcı bilgisi çekme
//     getCurrentUserByUsername(username, token)
//       .then(res => {
//         console.log('Kullanıcı bilgisi API response:', res);
//         if (res.isSuccess && res.data) {
//           setCurrentUser({
//             firstName: res.data.firstName,
//             lastName: res.data.lastName,
//             profession: res.data.profession,
//             city: res.data.city,
//             bio: res.data.bio,
//           });
//           setUserError('');
//         } else {
//           const errMsg = res.failMessage || 'Kullanıcı bilgisi alınamadı';
//           console.error('Kullanıcı bilgisi hatası:', errMsg);
//           setUserError(errMsg);
//         }
//       })
//       .catch(err => {
//         console.error('Kullanıcı bilgisi catch hatası:', err);
//         setUserError(err.message || 'Kullanıcı bilgisi alınamadı');
//       })
//       .finally(() => setUserLoading(false));

//     // Gönderiler çekme (sayfa 1)
//     getAllPostsPaged(1, token)
//       .then(res => {
//         console.log('Gönderiler API response:', res);
//         if (res.isSuccess && Array.isArray(res.data)) {
//           setPosts(res.data);
//           setPostsError('');
//         } else {
//           const errMsg = res.failMessage || 'Gönderiler alınamadı';
//           console.error('Gönderiler hatası:', errMsg);
//           setPostsError(errMsg);
//         }
//       })
//       .catch(err => {
//         console.error('Gönderiler catch hatası:', err);
//         setPostsError(err.message || 'Gönderiler alınamadı');
//       })
//       .finally(() => setPostsLoading(false));

//   }, []);

//   return (
//     <>
//       <Navbar />
//       <div className="homepage2-container" style={{ padding: 20 }}>
//         {/* Kullanıcı Bilgileri */}
//         <section>
//           <h2>Kullanıcı Bilgileri</h2>
//           {userLoading && <p>Yükleniyor...</p>}
//           {userError && <p style={{ color: 'red' }}>{userError}</p>}
//           {!userLoading && !userError && (
//             <div>
//               <p><strong>Ad Soyad:</strong> {currentUser.firstName} {currentUser.lastName}</p>
//               <p><strong>Meslek:</strong> {currentUser.profession}</p>
//               <p><strong>Şehir:</strong> {currentUser.city}</p>
//               <p><strong>Biyografi:</strong> {currentUser.bio}</p>
//             </div>
//           )}
//         </section>

//         {/* Gönderiler */}
//         <section style={{ marginTop: 40 }}>
//           <h2>Gönderiler</h2>
//           {postsLoading && <p>Gönderiler yükleniyor...</p>}
//           {postsError && <p style={{ color: 'red' }}>{postsError}</p>}
//           {!postsLoading && !postsError && posts.length === 0 && <p>Gönderi bulunamadı.</p>}
//           {!postsLoading && !postsError && posts.length > 0 && (
//             <ul>
//               {posts.map(post => (
//                 <li key={post.postId || post.id}>
//                   <p><strong>{post.firstName} {post.lastName}</strong></p>
//                   <p>{post.content}</p>
//                   <small>{new Date(post.createdAt).toLocaleString()}</small>
//                   <hr />
//                 </li>
//               ))}
//             </ul>
//           )}
//         </section>
//       </div>
//     </>
//   );
// }

// export default Homepage2;
