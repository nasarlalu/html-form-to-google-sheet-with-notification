import React, { useState, useRef } from "react";

export default FormExample = () => {
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const scriptUrl = "YOUR SCRIPT URL";

  function handleFormSubmit(e) {
    e.preventDefault();
    setLoading(true);
    fetch(scriptUrl, {
      method: "POST",
      body: new FormData(formRef.current),
    })
      .then((res) => {
        console.log(res, "resss");
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }

  return (
    <form onSubmit={handleFormSubmit} ref={formRef}>
      <input type="text" placeholder="Enter Your Full Name" required name="Name" />

      <input type="number" placeholder="Enter Your Mobile Number" required name="Number" />

      <input
        type="email"
        placeholder="Enter Your Email"
        required
        name="Email"
      />

      <button type="submit">{loading ? "Booking..." : "Book Now"}</button>
    </form>
  );
};
