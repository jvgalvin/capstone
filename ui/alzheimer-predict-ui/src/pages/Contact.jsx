import Container from 'react-bootstrap/Container';

export default function Contact() {
  return (
    <Container className="d-flex align-items-center justify-content-center vh-100">
      <div className="card">
        <div className="card-body p-5">

          <h1 className="mb-5 text-center">Contact Us</h1>

          <form>
            <div className="row">
              <div className="col-12 col-md-6 mb-4">
                <div className="form-outline">
                  <input type="text" id="form6Example1" className="form-control" />
                  <label className="form-label" for="form6Example1">First name</label>
                </div>
              </div>
              <div className="col-12 col-md-6 mb-4">
                <div className="form-outline">
                  <input type="text" id="form6Example2" className="form-control" />
                  <label className="form-label" for="form6Example2">Last name</label>
                </div>
              </div>
            </div>

            <div className="form-outline mb-4">
              <input type="text" id="form6Example3" className="form-control" />
              <label className="form-label" for="form6Example3">Company name</label>
            </div>

            <div className="form-outline mb-4">
              <select className="form-control" name= 'Role'>
                  <option selected value="" />
                  <option value="Physician">Physician</option>
                  <option value="RN">RN</option>
                  <option value="AOther Medical Staffsian">Other Medical Staff</option>
              </select>
              <label className="form-label" for="form6Example3">Role</label>
            </div>

            <div className="form-outline mb-4">
              <input type="email" id="form6Example5" className="form-control" />
              <label className="form-label" for="form6Example5">Email</label>
            </div>

            <div className="form-outline mb-4">
              <input type="number" id="form6Example6" className="form-control" />
              <label className="form-label" for="form6Example6">Phone</label>
            </div>

            <div className="form-outline mb-4">
              <textarea className="form-control" id="form6Example7" rows="5"></textarea>
              <label className="form-label" for="form6Example7">Comments / Feedback</label>
            </div>

            <button type="submit" className="btn btn-secondary btn-rounded btn-block">Submit</button>
          </form>

        </div>
      </div>
    </Container> 
  );
}
