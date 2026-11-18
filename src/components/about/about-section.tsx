import { AboutStory } from "./01-story/about-story";
import { AboutValues } from "./02-values/about-values";
import { AboutSteps } from "./03-steps/about-steps";

export function AboutSection() {
  return (
    <div className="flex flex-col">
      <AboutStory />
      <AboutValues />
      <AboutSteps />
    </div>
  );
}

export default AboutSection;
