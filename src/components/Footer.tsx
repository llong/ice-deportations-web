export const Footer = () => (
  <footer className="bg-gray-100 py-6 mt-8">
    <div className="container mx-auto px-4 text-center text-gray-600">
      <p>
        Data sourced from{" "}
        <a
          href="https://twitter.com/ICEgov"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800"
        >
          ICE Twitter/X Account
        </a>
      </p>
      <p className="mt-2 text-sm">
        Last updated: {new Date().toLocaleDateString()}
      </p>
    </div>
  </footer>
);
