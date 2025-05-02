<div className="min-h-screen bg-gray-50">
{/* Search Filters */}
<div className="bg-white shadow-md -mt-8 mb-8 mx-6 lg:mx-auto max-w-6xl rounded-sm">
  <form onSubmit={handleSearch} className="p-6">
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="property-type">
          Property Type
        </label>
        <select
          id="property-type"
          className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
        >
          <option value="">Any Type</option>
          <option value="house">House</option>
          <option value="apartment">Apartment</option>
          <option value="villa">Villa</option>
          <option value="land">Land</option>
          <option value="commercial">Commercial</option>
        </select>
      </div>
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="property-status">
          Status
        </label>
        <select
          id="property-status"
          className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={propertyStatus}
          onChange={(e) => setPropertyStatus(e.target.value)}
        >
          <option value="">Any Status</option>
          <option value="for-sale">For Sale</option>
          <option value="for-rent">For Rent</option>
        </select>
      </div>
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="min-price">
          Min Price
        </label>
        <select
          id="min-price"
          className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        >
          <option value="">No Min</option>
          <option value="100000">$100,000</option>
          <option value="200000">$200,000</option>
          <option value="300000">$300,000</option>
          <option value="500000">$500,000</option>
          <option value="1000000">$1,000,000</option>
        </select>
      </div>
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="max-price">
          Max Price
        </label>
        <select
          id="max-price"
          className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        >
          <option value="">No Max</option>
          <option value="300000">$300,000</option>
          <option value="500000">$500,000</option>
          <option value="750000">$750,000</option>
          <option value="1000000">$1,000,000</option>
          <option value="2000000">$2,000,000+</option>
        </select>
      </div>
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">
          Location
        </label>
        <select
          id="location"
          className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        >
          <option value="">Any Location</option>
          <option value="ikoyi">Ikoyi</option>
          <option value="lekki">Lekki</option>
          <option value="vi">Victoria Island</option>
          <option value="ikeja">Ikeja</option>
          <option value="ajah">Ajah</option>
        </select>
      </div>
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rooms">
          Bedrooms
        </label>
        <select
          id="rooms"
          className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={rooms}
          onChange={(e) => setRooms(e.target.value)}
        >
          <option value="">Any</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
          <option value="5">5+</option>
        </select>
      </div>
    </div>
    <div className="flex justify-center">
      <button
        type="submit"
        className="bg-blue-700 text-white px-8 py-3 rounded-sm hover:bg-blue-800 transition-colors duration-200"
      >
        Search Properties
      </button>
    </div>
  </form>
</div>
</div>

const PropertyDetail = () => {
    const params = useParams();
    const slug = params.slug;
  
    // In a real application, you would fetch property data based on the slug
    // This is just mock data for demonstration
    const property = {
      id: slug,
      title: "Modern Luxury Villa",
      price: "$649,000",
      status: "FOR SALE",
      address: "Banana Island Road, Ikoyi, Lagos",
      description: "This stunning modern villa offers luxurious living with high-end finishes throughout. The open floor plan features a gourmet kitchen with top-of-the-line appliances, spacious living areas, and floor-to-ceiling windows that flood the home with natural light. The primary suite includes a spa-like bathroom and walk-in closet. Outside, enjoy the private garden and swimming pool.",
      features: [
        "4 Bedrooms",
        "3 Bathrooms",
        "2,450 sqft",
        "Built in 2020",
        "2 Car Garage",
        "Swimming Pool",
        "Garden",
        "Smart Home System",
        "Security System",
        "Central Air Conditioning"
      ],
      images: [
        "https://readdy.ai/api/search-image?query=Modern%2520luxury%2520home%2520exterior%2520with%2520large%2520windows%252C%2520contemporary%2520architecture%252C%2520professional%2520real%2520estate%2520photography%252C%2520twilight%2520shot%2520with%2520warm%2520interior%2520lights%252C%2520beautiful%2520landscaping%252C%2520high-end%2520residential%2520property&width=800&height=500&seq=2&orientation=landscape",
        "https://readdy.ai/api/search-image?query=Luxury%2520modern%2520kitchen%2520with%2520island%252C%2520white%2520cabinets%252C%2520marble%2520countertops%252C%2520high-end%2520appliances%252C%2520open%2520concept%252C%2520real%2520estate%2520interior%2520photography&width=800&height=500&seq=8&orientation=landscape",
        "https://readdy.ai/api/search-image?query=Elegant%2520modern%2520living%2520room%2520with%2520large%2520windows%252C%2520contemporary%2520furniture%252C%2520fireplace%252C%2520high%2520ceilings%252C%2520luxury%2520interior%2520design%252C%2520real%2520estate%2520photography&width=800&height=500&seq=9&orientation=landscape",
        "https://readdy.ai/api/search-image?query=Luxury%2520master%2520bedroom%2520with%2520king%2520bed%252C%2520elegant%2520decor%252C%2520large%2520windows%252C%2520walk-in%2520closet%252C%2520en-suite%2520bathroom%252C%2520high-end%2520real%2520estate%2520interior%2520photography&width=800&height=500&seq=10&orientation=landscape"
      ],
      agent: {
        name: "Sarah Johnson",
        phone: "+234 803 456 7890",
        email: "sarah.johnson@myhome.ng",
        photo: "https://readdy.ai/api/search-image?query=Professional%2520female%2520real%2520estate%2520agent%2520portrait%252C%2520confident%2520smile%252C%2520business%2520attire%252C%2520corporate%2520headshot%252C%2520neutral%2520background&width=150&height=150&seq=11"
      }
    };
  
    const [activeImage, setActiveImage] = React.useState(0);
  
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <div className="bg-white shadow-md">
          <div className="container mx-auto px-6">
            <div className="flex justify-between items-center py-4">
              <h1 className="text-2xl font-bold">
                <Link href="/" className="text-gray-800 hover:text-blue-700">
                  <span className="text-gray-500">my</span>
                  <span className="text-gray-700">HOME</span>
                </Link>
              </h1>
              <nav className="hidden md:flex space-x-8">
                <Link href="/" className="text-gray-600 hover:text-blue-700">Home</Link>
                <Link href="/properties" className="text-blue-700">Properties</Link>
                <Link href="/about" className="text-gray-600 hover:text-blue-700">About</Link>
                <Link href="/contact" className="text-gray-600 hover:text-blue-700">Contact</Link>
              </nav>
              <div className="flex items-center space-x-4">
                <button className="bg-blue-700 text-white px-4 py-2 rounded-sm hover:bg-blue-800 transition-colors duration-200">
                  Login
                </button>
                <button className="bg-pink-600 text-white px-4 py-2 rounded-sm hover:bg-pink-700 transition-colors duration-200">
                  Register
                </button>
              </div>
            </div>
          </div>
        </div>
  
        {/* Breadcrumb */}
        <div className="bg-gray-100 py-3">
          <div className="container mx-auto px-6">
            <div className="flex items-center text-sm text-gray-600">
              <Link href="/" className="hover:text-blue-700">Home</Link>
              <span className="mx-2">/</span>
              <Link href="/properties" className="hover:text-blue-700">Properties</Link>
              <span className="mx-2">/</span>
              <span className="text-blue-700">{property.title}</span>
            </div>
          </div>
        </div>
  
        {/* Property Details */}
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Images and Details */}
            <div className="w-full lg:w-2/3">
              {/* Main Image */}
              <div className="relative h-[500px] mb-4 overflow-hidden rounded-sm">
                <img
                  src={property.images[activeImage]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-blue-700 text-white px-3 py-1 text-sm font-semibold">
                  {property.status}
                </div>
              </div>
  
              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-4 mb-8">
                {property.images.map((image, index) => (
                  <div 
                    key={index} 
                    className={`h-24 cursor-pointer overflow-hidden rounded-sm ${activeImage === index ? 'ring-2 ring-blue-700' : ''}`}
                    onClick={() => setActiveImage(index)}
                  >
                    <img
                      src={image}
                      alt={`${property.title} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
  
              {/* Property Details */}
              <div className="bg-white p-6 rounded-sm shadow-md mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{property.title}</h1>
                <p className="text-gray-600 mb-4">
                  <i className="fas fa-map-marker-alt mr-2 text-blue-700"></i>
                  {property.address}
                </p>
                <div className="flex items-center mb-6">
                  <div className="text-2xl font-bold text-blue-700 mr-4">{property.price}</div>
                  <div className="flex space-x-2">
                    <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-full flex items-center text-sm">
                      <i className="far fa-heart mr-1"></i> Save
                    </button>
                    <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-full flex items-center text-sm">
                      <i className="fas fa-share-alt mr-1"></i> Share
                    </button>
                    <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-full flex items-center text-sm">
                      <i className="fas fa-print mr-1"></i> Print
                    </button>
                  </div>
                </div>
  
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center">
                    <i className="fas fa-bed text-xl text-blue-700 mr-3"></i>
                    <div>
                      <div className="text-sm text-gray-500">Bedrooms</div>
                      <div className="font-semibold">4</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-bath text-xl text-blue-700 mr-3"></i>
                    <div>
                      <div className="text-sm text-gray-500">Bathrooms</div>
                      <div className="font-semibold">3</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-ruler-combined text-xl text-blue-700 mr-3"></i>
                    <div>
                      <div className="text-sm text-gray-500">Area</div>
                      <div className="font-semibold">2,450 sqft</div>
                    </div>
                  </div>
                </div>
  
                <h2 className="text-xl font-bold text-gray-800 mb-3">Description</h2>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {property.description}
                </p>
  
                <h2 className="text-xl font-bold text-gray-800 mb-3">Features</h2>
                <ul className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-6">
                  {property.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <i className="fas fa-check text-green-500 mr-2"></i>
                      {feature}
                    </li>
                  ))}
                </ul>
  
                <h2 className="text-xl font-bold text-gray-800 mb-3">Location</h2>
                <div className="h-64 bg-gray-200 mb-6 rounded-sm">
                  {/* Map would go here - using placeholder */}
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    Interactive Map Would Be Displayed Here
                  </div>
                </div>
              </div>
            </div>
  
            {/* Right Column - Agent Info and Contact Form */}
            <div className="w-full lg:w-1/3">
              {/* Agent Information */}
              <div className="bg-white p-6 rounded-sm shadow-md mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Property Agent</h2>
                <div className="flex items-center mb-4">
                  <img
                    src={property.agent.photo}
                    alt={property.agent.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="font-bold text-gray-800">{property.agent.name}</h3>
                    <p className="text-gray-600 text-sm">Real Estate Agent</p>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <i className="fas fa-phone-alt text-blue-700 mr-3"></i>
                    <span className="text-gray-700">{property.agent.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-envelope text-blue-700 mr-3"></i>
                    <span className="text-gray-700">{property.agent.email}</span>
                  </div>
                </div>
                <button className="w-full bg-blue-700 text-white py-3 rounded-sm hover:bg-blue-800 transition-colors duration-200">
                  View Agent Profile
                </button>
              </div>
  
              {/* Contact Form */}
              <div className="bg-white p-6 rounded-sm shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Contact Agent</h2>
                <form>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                      Your Name
                    </label>
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      id="name"
                      type="text"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                      Email Address
                    </label>
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                      Phone Number
                    </label>
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
                      Message
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      id="message"
                      rows={4}
                      placeholder="I'm interested in this property..."
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-pink-600 text-white py-3 rounded-sm hover:bg-pink-700 transition-colors duration-200"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
  
        {/* Similar Properties */}
        <div className="bg-gray-100 py-12">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">Similar Properties</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Similar Property Card 1 */}
              <div className="bg-white rounded-sm shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative">
                  <img
                    src="https://readdy.ai/api/search-image?query=Modern%2520luxury%2520home%2520exterior%2520with%2520large%2520windows%252C%2520contemporary%2520architecture%252C%2520professional%2520real%2520estate%2520photography%252C%2520twilight%2520shot%2520with%2520warm%2520interior%2520lights%252C%2520beautiful%2520landscaping%252C%2520high-end%2520residential%2520property&width=600&height=400&seq=12&orientation=landscape"
                    alt="Similar Property"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-blue-700 text-white px-3 py-1 text-sm font-semibold">
                    FOR SALE
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Contemporary Villa</h3>
                    <div className="text-xl font-bold text-blue-700">$685,000</div>
                  </div>
                  <p className="text-gray-600 mb-4">
                    <i className="fas fa-map-marker-alt mr-2 text-blue-700"></i>
                    Lekki Phase 1, Lagos
                  </p>
                  <div className="flex justify-between text-gray-600 border-t border-gray-200 pt-4">
                    <div className="flex items-center">
                      <i className="fas fa-bed mr-2 text-blue-700"></i>
                      <span>4 Beds</span>
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-bath mr-2 text-blue-700"></i>
                      <span>3 Baths</span>
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-ruler-combined mr-2 text-blue-700"></i>
                      <span>2,650 sqft</span>
                    </div>
                  </div>
                </div>
              </div>
  
              {/* Similar Property Card 2 */}
              <div className="bg-white rounded-sm shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative">
                  <img
                    src="https://readdy.ai/api/search-image?query=Luxury%2520waterfront%2520property%2520with%2520modern%2520architecture%252C%2520floor%2520to%2520ceiling%2520windows%252C%2520infinity%2520pool%252C%2520ocean%2520view%252C%2520sunset%2520lighting%252C%2520high-end%2520real%2520estate%2520photography%252C%2520exclusive%2520beachfront%2520residence&width=600&height=400&seq=13&orientation=landscape"
                    alt="Similar Property"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-blue-700 text-white px-3 py-1 text-sm font-semibold">
                    FOR SALE
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Waterfront Mansion</h3>
                    <div className="text-xl font-bold text-blue-700">$1,150,000</div>
                  </div>
                  <p className="text-gray-600 mb-4">
                    <i className="fas fa-map-marker-alt mr-2 text-blue-700"></i>
                    Banana Island, Ikoyi, Lagos
                  </p>
                  <div className="flex justify-between text-gray-600 border-t border-gray-200 pt-4">
                    <div className="flex items-center">
                      <i className="fas fa-bed mr-2 text-blue-700"></i>
                      <span>5 Beds</span>
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-bath mr-2 text-blue-700"></i>
                      <span>4 Baths</span>
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-ruler-combined mr-2 text-blue-700"></i>
                      <span>3,800 sqft</span>
                    </div>
                  </div>
                </div>
              </div>
  
              {/* Similar Property Card 3 */}
              <div className="bg-white rounded-sm shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative">
                  <img
                    src="https://readdy.ai/api/search-image?query=Modern%2520apartment%2520building%2520exterior%252C%2520contemporary%2520urban%2520architecture%252C%2520glass%2520and%2520steel%2520facade%252C%2520luxury%2520condominium%252C%2520professional%2520real%2520estate%2520photography%252C%2520blue%2520sky%2520background%252C%2520upscale%2520city%2520living&width=600&height=400&seq=14&orientation=landscape"
                    alt="Similar Property"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 text-sm font-semibold">
                    FOR RENT
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Luxury Penthouse</h3>
                    <div className="text-xl font-bold text-blue-500">$3,500/mo</div>
                  </div>
                  <p className="text-gray-600 mb-4">
                    <i className="fas fa-map-marker-alt mr-2 text-blue-500"></i>
                    Victoria Island, Lagos
                  </p>
                  <div className="flex justify-between text-gray-600 border-t border-gray-200 pt-4">
                    <div className="flex items-center">
                      <i className="fas fa-bed mr-2 text-blue-500"></i>
                      <span>3 Beds</span>
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-bath mr-2 text-blue-500"></i>
                      <span>3 Baths</span>
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-ruler-combined mr-2 text-blue-500"></i>
                      <span>2,200 sqft</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        {/* Footer */}
        <footer className="bg-gray-800 text-white py-12">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">About myHOME</h3>
                <p className="text-gray-400 mb-4">
                  myHOME is Nigeria's premier real estate platform, connecting buyers, sellers, and renters with the perfect properties across the country.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-white">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">Home</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Properties</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Agents</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Contact Us</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Cities</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">Lagos</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Abuja</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Port Harcourt</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Ibadan</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Kano</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Contact Us</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <i className="fas fa-map-marker-alt mt-1 mr-3 text-blue-500"></i>
                    <span className="text-gray-400">Victoria Island, Lagos, Nigeria</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-phone-alt mt-1 mr-3 text-blue-500"></i>
                    <span className="text-gray-400">+234 803 123 4567</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-envelope mt-1 mr-3 text-blue-500"></i>
                    <span className="text-gray-400">info@myhome.ng</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2023 myHOME. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    );
  };