import rp from 'request-promise';
import rd from 'request-debug';

export default function request(debug = false) {
  if (debug) {
    rd(rp, (req, res) => {
      console.log(req);
      console.log(res);
    });
  }
  return rp;
}
