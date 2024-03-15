import React from "react";

const DiscriptionCollection = (props) => {
  return (
    <>
      <div
        style={{
          maxWidth: "767px",
        }}
        className="mt-5 pt-3 pb-5"
      >
        <p className="mb-3 text-medium-grey">{props.description}</p>
        {/* <p className="mb-3 text-medium-grey">
          The "Whispers of Elysium" collection is a profound exploration of the
          ethereal, converging the boundaries of reality and dreams. Spread
          across twenty captivating pieces, each artwork acts as a portal,
          transporting its viewer to vistas of imagined landscapes and celestial
          reveries. Utilizing a mix of pastel hues and vibrant shocks of color,
          the artist captures the delicate dance between light and shadow,
          evoking a sense of otherworldly serenity.
        </p> */}
        {/* <p className="mb-3 text-medium-grey">
          One can't help but feel a pull towards the central motif that runs
          through the series: the fleeting moments between dusk and dawn, where
          reality seems suspended in a gossamer veil of wonder. The texture, a
          blend of rough brush strokes juxtaposed with smooth gradient
          transitions, challenges the viewer's perception of space and depth.
        </p>
        <p className="mb-3 text-medium-grey">
          Perhaps the most striking element is the recurring silhouette of a
          solitary figure, always poised at the brink of discovery.
        </p> */}
      </div>
    </>
  );
};

export default DiscriptionCollection;
