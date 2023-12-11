import { Link } from "react-router-dom";
import isabelle from '../assets/IsabelleAmick.jpeg'
import paul from '../assets/PaulArellano.jpg'
import jack from '../assets/JackGalvin.jpg'
import martin from '../assets/MartinLim.jpg'
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import AlzheimerTableau from '../tableau/AlzheimerTableau'

export default function About() {
  return (
    <Accordion defaultActiveKey={['0', '1', '2']} alwaysOpen>
      <Accordion.Item eventKey="0">
        <Accordion.Header>Mission</Accordion.Header>
        <Accordion.Body>
        <p><em><b>Improve health outcomes for Alzheimer’s patients and ease the burden of care through the use of machine learning for earlier diagnosis.</b></em></p>
        <br></br>
        <br></br>
        <p>Currently, 7 million Americans are living with Alzheimer's Disease, but the emotional and financial burden of this terrible disease extends far beyond this number. The disease is expected to cost the US over 1 trillion dollars by the year 2050, with family members and unpaid caregivers already providing over 340 billion dollars each year. We are here to reduce these numbers, and, more importantly, to improve patient care and outcomes.</p>
        <br></br>
        <p>With this complex disease, there is no simple diagnosis, but studies have shown that early diagnosis is key. With only 60% of physicians stating that they feel comfortable in their Alzheimer's diagnoses, there is an obvious need for additional tools to help guide physicians to make these calls.</p>
        <br></br>
        <p>Our tool allows physicians to use patients' clinical, genetic, and MRI imaging data to predict the likelihood of developing Alzheimer's Disease within the next 5 years. Unlike our competitors, who use only imagining data, we make use of multimodal modeling to combine these distinct data sources, increasing the accuracy of our predictions. Not only will this help improve patient outcomes, but early diagnosis is also predicted to decrease healthcare costs by 30%.</p>
        <br></br>
        <p>We may just be a group of data scientists, but we are also daughters, sons, grandchildren, and friends of those affected by this terrible disease, and we are proud to play a small part in improving the lives of those who need it most.</p>
        <br></br>
        <p>-Isabelle Amick, Paul Arellano, Jack Galvin, Martin Lim</p>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header>About Us</Accordion.Header>
        <Accordion.Body>
          <CardGroup>
          <Card>
            <Card.Img variant="top" src={isabelle} />
              <Card.Body>
                <Card.Title>Isabelle Amick</Card.Title>
                <Card.Text>
                  A Chemist turned Data Scientist, Isabelle has a Bachelor's in Chemistry from Johns Hopkins University,
                  a PhD in Pharmaceutical Sciences from the University of North Carolina at Chapel Hill, and a Master's
                  in Information and Data Science from the University of California, Berkeley. She now works to combine these skills
                  as a data scientist in the healthcare and pharma space. Outside of work, Isabelle loves spending time with family, 
                  dancing, and volunteering at the animal shelter.
                </Card.Text>
              </Card.Body>
            </Card>
            <Card>
              <Card.Img variant="top" src={paul} />
              <Card.Body>
                <Card.Title>Paul Arellano</Card.Title>
                <Card.Text>
                Paul is a Software Engineer who currently works at Cisco Meraki. 
                He has a Bachelor's in Computer Science from East Carolina University and a Master's
                in Information and Data Science from the University of California, Berkeley. 
                His career began as a Front end mobile developer creating applications for both Android and iOS. 
                While gaining experience, he was able to transition into a Fullstack developer role, creating API's and 
                CI / CD pipelines. He enjoys playing tennis and spending time with his family whenever possible.
                </Card.Text>
              </Card.Body>
            </Card>
            <Card>
              <Card.Img variant="top" src={jack} />
              <Card.Body>
                <Card.Title>Jack Galvin</Card.Title>
                <Card.Text>
                Jack earned his Bachelor's in Neuroscience from Colgate University and his Master's in Information and Data Science from the University of California, Berkeley. 
                He is interested in training and deploying machine learning models within contexts where such techniques have not yet been exploited at scale. 
                He enjoys golfing, traveling, mountain biking, and spending time with his french bulldog.
                </Card.Text>
              </Card.Body>
            </Card>
            <Card>
              <Card.Img variant="top" src={martin} />
              <Card.Body>
                <Card.Title>Martin Lim</Card.Title>
                <Card.Text>
                Data engineer by trade and grad student by night based in the Philippines. 
                Martin graduated with an Electronics Engineering degree from De La Salle University Manila and a Master's
                in Information and Data Science from the University of California, Berkeley. 
                He currently works for ING Shared Services Philippines and helps ING mobilize and utilize their data 
                in the public cloud space. Martin is always ready to embrace a new challenge and is always on the 
                lookout for a way to apply whatever tech he gets his hands on.
                </Card.Text>
              </Card.Body>
            </Card>
          </CardGroup>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="2">
        <Accordion.Header>Training Data</Accordion.Header>
        <Accordion.Body>
          Training data was gathered from the Alzheimer's Disease Neuroimaging Initiative (ADNI). Complete information for the dataset can be found at <a href="https://adni.loni.usc.edu/about/" target="_blank">adni.loni.usc.edu</a>.
          {/* <div id="content">
            <iframe width="1000px" height="1000px" frameborder="0" src="https:&#47;&#47;public.tableau.com&#47;static&#47;images&#47;Ca&#47;Capstone_16965503257270&#47;Dashboard1&#47;1_rss.png"></iframe>
        </div> */}
        <AlzheimerTableau></AlzheimerTableau>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}
