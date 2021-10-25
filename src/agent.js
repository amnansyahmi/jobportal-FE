/* Connection to API*/
import axios from 'axios';
import qs from 'qs';

const API_ROOT = process.env.REACT_APP_SERVER_URL;

const encode = encodeURIComponent;
// const responseBody = res => res.body;

let token = null;
// const tokenPlugin = req => {
//   if (token) {
//     req.set('authorization', `Token ${token}`);
//   }
// }

const config = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
}

const requests = {
  // del: url =>
  //   superagent.del(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
  get: url =>
    axios.get(`${API_ROOT}${url}`),
  request: url =>
    axios.request(`${API_ROOT}${url}`),
  delete: url =>
    axios.delete(`${API_ROOT}${url}`),  
  post: url =>
    axios.post(`${API_ROOT}${url}`),
  JSONPost: (url,data) =>
    axios.post(`${API_ROOT}${url}`,`${data}`,config),  
};

const Auth = {
  current: () =>
    requests.get('/user'),
  login: () =>
    requests.post('/login?userid=B515&password=asd'),
  register: (username, email, password) =>
    requests.post('/users', { user: { username, email, password } }),
  save: user =>
    requests.put('/user', { user })
};

const Tags = {
  getAll: () => requests.get('/tags')
};

const limit = (count, p) => `limit=${count}&offset=${p ? p * count : 0}`;
const omitSlug = article => Object.assign({}, article, { slug: undefined })
const Articles = {
  all: page =>
    requests.get(`/articles?${limit(10, page)}`),
  byAuthor: (author, page) =>
    requests.get(`/articles?author=${encode(author)}&${limit(5, page)}`),
  byTag: (tag, page) =>
    requests.get(`/articles?tag=${encode(tag)}&${limit(10, page)}`),
  del: slug =>
    requests.del(`/articles/${slug}`),
  favorite: slug =>
    requests.post(`/articles/${slug}/favorite`),
  favoritedBy: (author, page) =>
    requests.get(`/articles?favorited=${encode(author)}&${limit(5, page)}`),
  feed: () =>
    requests.get('/articles/feed?limit=10&offset=0'),
  get: slug =>
    requests.get(`/articles/${slug}`),
  unfavorite: slug =>
    requests.del(`/articles/${slug}/favorite`),
  update: article =>
    requests.put(`/articles/${article.slug}`, { article: omitSlug(article) }),
  create: article =>
    requests.post('/articles', { article })
};

const Comments = {
  create: (slug, comment) =>
    requests.post(`/articles/${slug}/comments`, { comment }),
  delete: (slug, commentId) =>
    requests.del(`/articles/${slug}/comments/${commentId}`),
  forArticle: slug =>
    requests.get(`/articles/${slug}/comments`)
};

//AS20201008

const Login = {
  // post: (userid, password, token) =>
  //   //requests.post(`/login?userid=${userid}&password=${encodeURIComponent(password)}`),
  //   requests.JSONPost(`/login`, qs.stringify({ userid: userid, password: encodeURIComponent(password), token: encodeURIComponent(token) })),
  post: (userid, password) =>
  requests.JSONPost(`/login`, qs.stringify({ userid: userid, password: encodeURIComponent(password)})),
  get: (userid, password) =>
    requests.get(`/login?userid=${userid}&password=${encodeURIComponent(password)}`),
};

const GetCodeConfig = {
  get: (PrimeCode) =>
    requests.get(`/GetCodeConfig?PrimeCode=${PrimeCode}`),
}

const GetApplicantDetails = {
  get: (email) =>
    requests.get(`/GetApplicantDetails?email=${email}`),
}

const GetJobList = {
  get: () =>
    requests.get(`/GetJobList`),
}

const GetSkills = {
  get: () =>
    requests.get(`/GetSkills`),
}

const AddApplicant = {
  post: (firstName, lastName, jobId, yearsExp, prefLocation, vacancyFoundIn, noticePeriod, contactNo, address, email, fileName, filePath, fileEncode, skills) =>
    requests.JSONPost(`/AddApplicant`,qs.stringify({ 
      firstName: encodeURIComponent(firstName), 
      lastName: encodeURIComponent(lastName), 
      jobId: encodeURIComponent(jobId), 
      yearsExp: encodeURIComponent(yearsExp), 
      prefLocation: encodeURIComponent(prefLocation), 
      vacancyFoundIn: encodeURIComponent(vacancyFoundIn), 
      noticePeriod: encodeURIComponent(noticePeriod), 
      contactNo: encodeURIComponent(contactNo), 
      address: encodeURIComponent(address), 
      email: encodeURIComponent(email),
      fileName: encodeURIComponent(fileName), 
      filePath: encodeURIComponent(filePath), 
      fileEncode: encodeURIComponent(fileEncode),
      skills: encodeURIComponent(skills)
    })),
};
  
export default {
  Articles,
  Auth,
  Comments,
  Login,
  Tags,


  GetJobList,
  GetSkills,
  AddApplicant,
  GetCodeConfig,
  GetApplicantDetails,
  
  setToken: _token => { token = _token; }
};
