import { Button } from "react-bootstrap";
import { 
  FaFire, 
  FaHeart, 
  FaComment, 
  FaGlobe, 
  FaUserCircle 
} from "react-icons/fa";

const FeedControls = ({ filter, setFilter }) => {
  const filters = [
    { 
      id: "all", 
      label: "All Posts", 
      icon: <FaGlobe size={14} /> 
    },
    { 
      id: "forYou", 
      label: "For You", 
      icon: <FaUserCircle size={14} /> 
    },
    { 
      id: "liked", 
      label: "Most Liked", 
      icon: <FaHeart size={14} /> 
    },
    { 
      id: "commented", 
      label: "Most Commented", 
      icon: <FaComment size={14} /> 
    },
  ];

  return (
    <div className="d-flex align-items-center justify-content-center gap-2 flex-wrap mb-3">
      {filters.map((filterItem) => (
        <Button
          key={filterItem.id}
          size="sm"
          className={`rounded-pill px-3 d-flex align-items-center ${
            filter === filterItem.id 
              ? 'btn-primary' 
              : 'btn-outline-secondary'
          }`}
          onClick={() => setFilter(filterItem.id)}
          variant={filter === filterItem.id ? "primary" : "outline-secondary"}
        >
          <span className="me-1">{filterItem.icon}</span>
          {filterItem.label}
        </Button>
      ))}
    </div>
  );
};

export default FeedControls;