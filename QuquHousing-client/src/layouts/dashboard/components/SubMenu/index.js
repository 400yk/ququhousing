
function SubMenu({ items, onSelect }) {
    return (
      <ul className="sub-menu">
        {items.map((item, index) => (
          <li key={index} onClick={() => onSelect(index)}>
            {item.label}
          </li>
        ))}
      </ul>
    );
  }

  export default SubMenu;