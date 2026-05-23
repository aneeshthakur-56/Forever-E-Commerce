import { assets } from "../assets/frontend_assets/assets";
import NewsLetter from "../components/NewsLetter";
import Title from "../components/Title";

const About = () => {
  return (
    <div>
      {/* Heading */}
      <div className="text-2xl text-center pt-8 border-t">
        <Title text1={"ABOUT "} text2={"US"} />
      </div>

      {/* Image + Story */}
      <div className="my-10 flex flex-col md:flex-row gap-16">
        <img
          className="w-full md:max-w-[450px]"
          src={assets.about_img}
          alt="Our team at work"
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <p>
            Forever was born out of a passion for innovation and a desire to
            revolutionize the way people shop online. Our journey began with a
            simple idea — to provide a platform where customers can easily
            discover, explore, and purchase a wide range of products from the
            comfort of their homes.
          </p>
          <p>
            Since our founding, we've worked tirelessly to curate a diverse
            selection of high-quality products that cater to every taste and
            preference. From fashion to electronics, home essentials to beauty
            products, we offer an extensive collection sourced from trusted
            brands and suppliers.
          </p>
          <b className="text-gray-800">Our Mission</b>
          <p>
            Our mission at Forever is to empower customers with choice, quality,
            and convenience. We're dedicated to providing a seamless shopping
            experience that exceeds expectations — from browsing to delivery and
            beyond.
          </p>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="text-2xl py-4">
        <Title text1={"WHY "} text2={"CHOOSE US"} />
      </div>

      <div className="flex flex-col md:flex-row text-sm mb-20">
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Quality Assurance:</b>
          <p className="text-gray-600">
            We meticulously select and vet every product to ensure it meets our
            strict quality standards — so you never have to second-guess your
            purchase.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Convenience:</b>
          <p className="text-gray-600">
            With an intuitive interface and hassle-free navigation, shopping
            with us is designed to save you time and effort at every step.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Exceptional Customer Service:</b>
          <p className="text-gray-600">
            Our dedicated support team is available around the clock to assist
            you — ensuring your questions are answered and issues resolved
            promptly.
          </p>
        </div>
      </div>
      <NewsLetter />
    </div>
  );
};

export default About;
