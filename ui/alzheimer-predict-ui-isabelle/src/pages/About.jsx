import { Link } from "react-router-dom";
import Accordion from 'react-bootstrap/Accordion';

export default function About() {
  return (
    <Accordion defaultActiveKey={['0']} alwaysOpen>
      <Accordion.Item eventKey="0">
        <Accordion.Header>Mission</Accordion.Header>
        <Accordion.Body>
        <p>Currently, 7 million Americans are living with Alzheimer’s Disease, but the emotional and financial burden of this terrible disease extends far beyond this number. The disease is expected to cost the US over 1 trillion dollars by the year 2050, with family members and unpaid caregivers already providing over 340 billion dollars each year. We are here to reduce these numbers, and, more importantly, to improve patient care and outcomes.</p>
        <br></br>
        <p>With this complex disease, there is no simple diagnosis, but studies have shown that early diagnosis is key. With only 60% of physicians stating that they feel comfortable in their Alzheimer’s diagnoses, there is an obvious need for additional tools to help guide physicians to make these calls.</p>
        <br></br>
        <p>Our tool allows physicians to use patients’ clinical, genetic, and MRI imaging data to predict the likelihood of developing Alzheimer’s Disease within the next 5 years. Unlike our competitors, who use only imagining data, we make use of multimodal modeling to combine these distinct data sources, increasing the accuracy of our predictions. Not only will this help improve patient outcomes, but early diagnosis is also predicted to decrease healthcare costs by 30%.</p>
        <br></br>
        <p>We may just be a group of data scientists, but we are also daughters, sons, grandchildren, and friends of those affected by this terrible disease, and we are proud to play a small part in improving the lives of those who need it most.</p>
        <br></br>
        <p>-Isabelle Amick, Paul Arellano, Jack Galvin, Martin Lim</p>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header>Training Data</Accordion.Header>
        <Accordion.Body>
          Training data was gathered from the Alzheimer’s Disease Neuroimaging Initiative (ADNI). Complete information for the dataset can be found at <a href="https://adni.loni.usc.edu/about/" target="_blank">adni.loni.usc.edu</a>.
          <div id="content">
            <iframe width="1000px" height="1000px" frameborder="0" src="https:&#47;&#47;public.tableau.com&#47;static&#47;images&#47;Ca&#47;Capstone_16965503257270&#47;Dashboard1&#47;1_rss.png"></iframe>
        </div>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}
