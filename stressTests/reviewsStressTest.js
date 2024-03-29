import http from 'k6/http';
import { check } from 'k6';

export default function () {
   // const rnd = Math.floor(Math.random() * 100);
    const response = http.get('http://127.0.0.1:3000/api/reviews');
    // console.log('Response time was ' + String(response.timings.duration) + ' ms');
    check(response, {
        "is status 200": (r) => r.status === 200,
    })
}

export let options = {
  scenarios: {
    constant_request_rate: {
      executor: 'constant-arrival-rate',
      rate: 100,
      timeUnit: '1s',
      duration: '1m',
      preAllocatedVUs: 20,
      maxVUs: 50,
    },
  },
};