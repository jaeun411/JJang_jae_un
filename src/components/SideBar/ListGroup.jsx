import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ListGroup.css';

const ScrollspyMenu = () => {
    const [selectedMenu, setSelectedMenu] = useState('');

    const handleMenuSelect = (menu) => {
        setSelectedMenu(menu);
        const target = document.getElementById(menu.replace(/ /g, '-'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="container">
            <div className="col">
                <div className="row-4">
                    <div id="list-example" className="list-group">
                        <a
                            className="list-group-item list-group-item-action"
                            href="#list-item-1"
                            onClick={() => handleMenuSelect('Item 1')}
                        >
                            Item 1
                        </a>
                        <a
                            className="list-group-item list-group-item-action"
                            href="#list-item-2"
                            onClick={() => handleMenuSelect('Item 2')}
                        >
                            Item 2
                        </a>
                        <a
                            className="list-group-item list-group-item-action"
                            href="#list-item-3"
                            onClick={() => handleMenuSelect('Item 3')}
                        >
                            Item 3
                        </a>
                        <a
                            className="list-group-item list-group-item-action"
                            href="#list-item-4"
                            onClick={() => handleMenuSelect('Item 4')}
                        >
                            Item 4
                        </a>
                        <a
                            className="list-group-item list-group-item-action"
                            href="#list-item-2"
                            onClick={() => handleMenuSelect('Item 2')}
                        >
                            Item 2
                        </a>
                        <a
                            className="list-group-item list-group-item-action"
                            href="#list-item-3"
                            onClick={() => handleMenuSelect('Item 3')}
                        >
                            Item 3
                        </a>
                        <a
                            className="list-group-item list-group-item-action"
                            href="#list-item-4"
                            onClick={() => handleMenuSelect('Item 4')}
                        >
                            Item 4
                        </a>
                        <a
                            className="list-group-item list-group-item-action"
                            href="#list-item-2"
                            onClick={() => handleMenuSelect('Item 2')}
                        >
                            Item 2
                        </a>
                        <a
                            className="list-group-item list-group-item-action"
                            href="#list-item-3"
                            onClick={() => handleMenuSelect('Item 3')}
                        >
                            Item 3
                        </a>
                        <a
                            className="list-group-item list-group-item-action"
                            href="#list-item-4"
                            onClick={() => handleMenuSelect('Item 4')}
                        >
                            Item 4
                        </a>
                    </div>
                </div>
                <div className="col-8">
                    <div className="scrollspy-example">
                        {selectedMenu && (
                            <div id={selectedMenu.replace(/ /g, '-')} style={{padding: '20px 0'}}>
                                <h4>{selectedMenu}</h4>
                                <p>
                                    {/* 여기에 선택한 메뉴에 해당하는 내용을 작성하세요. */}
                                    {/* 예: "Item 1"를 선택했을 때 */}
                                    {/* Lorem ipsum dolor sit amet, consectetur adipiscing elit... */}
                                    {/* 예: "Item 2"를 선택했을 때 */}
                                    {/* Suspendisse potenti. Phasellus a risus id odio eleifend... */}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScrollspyMenu;
