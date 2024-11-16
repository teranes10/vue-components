import { ref, Ref } from "vue";
import styles from './ER_Diagram.module.css'

export type Entity = {
  name: string;
  columns: Column[];
  el?: HTMLElement;
  pointerEl?: HTMLElement;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  maxY?: number;
  connections?: Connection[]
};

export type Column = {
  name: string;
  type: string;
  el?: HTMLElement;
  constraints?: string[];
  relationship?: {
    table: string;
    column: string;
    type: string;
  };
  connections?: Connection[];
};

export type Connection = {
  parentRect: HTMLElement;
  entityRect: HTMLElement;
  setMouseOver: (event: MouseEvent) => void;
  clear: () => void;
};


export function autoCorrectPositions(entities: Ref<Entity[]>, containerEl: Ref<HTMLElement | undefined>, gap: number) {
  if (!(containerEl.value?.offsetWidth)) {
    return;
  }

  const entitiesWithConnection = new Map<any, any[]>();

  for (const entity of entities.value) {
    for (const column of entity.columns) {
      const ref = column.relationship;
      if (ref && ref.table && ref.column) {
        const connections = entitiesWithConnection.get(ref.table) || [];
        const connection = {
          _parent: ref,
          _entity: entity,
          entity: entity.name,
          column: column.name,
          parentColumn: ref.column
        }

        connections.push(connection);
        entitiesWithConnection.set(ref.table, connections);

        entity.connections = connections;
      }
    }
  }

  const _entities = entities.value.slice().sort((a, b) => {
    const aLen = entitiesWithConnection.get(a.name)?.length || 0;
    const bLen = entitiesWithConnection.get(b.name)?.length || 0;
    return bLen - aLen;
  });

  const added = ref(new Map<string, any>());

  function setEntityPositions(entity: any) {
    //set positions for sub entities
    const refs = entitiesWithConnection.get(entity.name) || [];

    let currentTop = (entity.y || 0);
    let currentLeft = gap + (entity.x || 0) + (entity.el?.offsetWidth || 0);

    for (const ref of refs) {
      if (!added.value.has(ref.table)) {
        ref._entity.x = currentLeft;
        ref._entity.y = currentTop;
        ref._entity.w = ref._entity.el?.offsetWidth;
        ref._entity.h = ref._entity.el?.offsetHeight

        currentTop += gap + (ref._entity.el?.offsetHeight || 0)

        added.value.set(ref._entity.name, ref._entity)
        setEntityPositions(ref._entity);

        entity.maxY = Math.max(ref._entity.maxY || 0, currentTop)
      }
    }

    return refs && refs.length > 0
  }

  let currentTop = 0;
  let currentLeft = 0;
  let maxY = 0;
  for (const entity of _entities) {
    if (!added.value.has(entity.name)) {

      const connections = entitiesWithConnection.get(entity.name);
      if (connections) {

        const connection = connections.find(x => added.value.has(x.table));
        if (connection) {
          //set positions for sub entities
          let y = connection._entity.y;
          let x = gap + (connection._entity.x || 0) + (connection._entity.el?.offsetWidth || 0);
          const old = Array.from(added.value.values()).find(entity => entity.x === x && entity.y === y)

          if (old && old.el) {
            y += old.el.offsetHeight + gap
          }

          entity.y = y;
          entity.x = x;

          currentTop = Math.max(currentTop, (entity?.maxY || entity?.y || 0) + (entity?.el?.offsetHeight || 0) + gap)

        } else {
          //set positions for root entities
          const rootEntity = Array.from(added.value.values())?.findLast(x => !x.x)
          if (rootEntity && rootEntity.el) {
            entity.y = (rootEntity.maxY || 0)
          }

          currentTop = Math.max(currentTop, (rootEntity?.maxY || 0), (entity?.maxY || 0))
        }
      }

      if (!setEntityPositions(entity)) {
        //set positions for entities does not have any relations

        entity.y = currentTop;
        entity.x = currentLeft;
        entity.w = entity.el?.offsetWidth;
        entity.h = entity.el?.offsetHeight;

        currentLeft += gap + (entity.el?.offsetWidth || 0);
        if (currentLeft > containerEl.value?.offsetWidth) {
          currentLeft = 0;
          currentTop = maxY + gap
        } else {
          maxY = Math.max(maxY, (entity.y + (entity.h || 0)))
        }
      }

      added.value.set(entity.name, entity)
    }
  }
}

export function updateConnections(entities: Ref<Entity[]>, containerEl: Ref<HTMLElement | undefined>, gap: number) {
  clearConnections(entities);

  if (!containerEl.value) {
    return;
  }

  for (const e of entities.value) {
    if (!e.el) {
      continue;
    }

    for (let ec of e.columns) {
      if (!ec.el || !ec.relationship || !ec.relationship.table || !ec.relationship.column) {
        continue;
      }

      const re = entities.value.find(x => ec.relationship?.table && x.name === ec.relationship.table);
      if (!re || !re.el) {
        continue;
      }

      const rc = re.columns.find(x => ec.relationship?.column && x.name === ec.relationship.column);
      if (!rc || !rc.el) {
        continue;
      }

      let { w: ecW, x: ecX, y: ecY } = getColumnCoordinates(e.el, ec.el);
      let { w: rcW, x: rcX, y: rcY } = getColumnCoordinates(re.el, rc.el);

      const reL = rcX - gap;
      const reR = rcX + rcW + gap;
      const eL = ecX - gap;
      const eR = ecX + ecW + gap;
      const isIntersecting = (reL < ecX && ecX < reR) || (eL < rcX && rcX < eR)

      if (isIntersecting) {
        rcX += rcW
        ecX += ecW
      } else if (rcX < ecX) {
        rcX += rcW
      } else {
        ecX += ecW
      }

      const xGap = Math.abs(rcX - ecX);
      const yGap = Math.abs(rcY - ecY);

      const rcRectX = isIntersecting || (rcX < ecX) ? rcX : rcX - (xGap / 2);
      const ecRectX = isIntersecting || (rcX > ecX) ? ecX : ecX - (xGap / 2);
      const rcRectY = (rcY < ecY) ? rcY : rcY - (yGap / 2);
      const ecRectY = (rcY > ecY) ? ecY : ecY - (yGap / 2);

      const rcRectB = isIntersecting ? (rcY < ecY ? styles.btr : styles.bbr) : (rcX < ecX ? (rcY < ecY ? styles.btr : styles.bbr) : (rcY < ecY ? styles.btl : styles.bbl));
      const ecRectB = isIntersecting ? (rcY < ecY ? styles.bbr : styles.btr) : (rcX < ecX ? (rcY < ecY ? styles.bbl : styles.btl) : (rcY < ecY ? styles.bbr : styles.btr));

      const rcRectW = isIntersecting ? (rcX < ecX ? xGap + gap : gap) : (rcRectB === styles.btr || rcRectB === styles.bbr ? (xGap / 2) + 1 : (xGap / 2));
      const ecRectW = isIntersecting ? (rcX < ecX ? gap : xGap + gap) : (ecRectB === styles.btr || ecRectB === styles.bbr ? (xGap / 2) + 1 : (xGap / 2));
      const rcRectH = yGap / 2
      const ecRectH = yGap / 2

      const rcRect = createConnectionRect(rcRectW, rcRectH, rcRectY, rcRectX, rcRectB);
      const ecRect = createConnectionRect(ecRectW, ecRectH, ecRectY, ecRectX, ecRectB);
      containerEl.value.appendChild(rcRect)
      containerEl.value.appendChild(ecRect);

      const onMouseOver = (event: MouseEvent) => {
        if (!ec.el || !rc.el) {
          return;
        }

        const active = isMouseOverBorder(rcRect, rcRectB, 10, event) ||
          isMouseOverBorder(ecRect, ecRectB, 10, event) ||
          isMouseOverElement(rc.el, event) ||
          isMouseOverElement(ec.el, event);

        if (active) {
          rc.el.classList.add(styles.active)
          ec.el.classList.add(styles.active)
          rcRect.classList.add(styles.active)
          ecRect.classList.add(styles.active)
        } else {
          rc.el.classList.remove(styles.active)
          ec.el.classList.remove(styles.active)
          rcRect.classList.remove(styles.active)
          ecRect.classList.remove(styles.active)
        }
      }

      ec.connections ??= [];
      ec.connections.push({
        parentRect: rcRect,
        entityRect: ecRect,
        setMouseOver: onMouseOver,
        clear: () => {
          rcRect.remove();
          ecRect.remove();
        }
      })
    }
  }

  for (let entity of entities.value) {
    for (let column of entity.columns) {
      if (!column.connections) {
        continue;
      }

      for (let connection of column.connections) {
        containerEl.value.addEventListener('mouseover', (e) => connection.setMouseOver(e))
      }
    }
  }
}

function clearConnections(entities: Ref<Entity[]>) {
  for (let entity of entities.value) {
    for (let column of entity.columns) {
      if (!column.connections) {
        continue;
      }

      for (let connection of column.connections) {
        connection.clear();
      }

      column.connections.splice(0);
    }
  }
}

function getColumnCoordinates(entityEl: HTMLElement, columnEl: HTMLElement) {
  var w = columnEl.offsetWidth;
  var h = columnEl.offsetHeight
  var x = entityEl.offsetLeft;
  var y = entityEl.offsetTop + (columnEl.getBoundingClientRect().top - entityEl.getBoundingClientRect().top) + (h / 2);
  return { w, h, x, y }
}

function createConnectionRect(width: number, height: number, top: number, left: number, borderClass: string) {
  const rect = document.createElement('div');
  rect.className = `${styles.entityRelation} ${borderClass}`
  rect.style.width = `${width}px`;
  rect.style.height = `${height}px`;
  rect.style.top = `${top}px`
  rect.style.left = `${left}px`
  return rect
};

function isMouseOverBorder(element: HTMLElement, border: string, borderWidth: number, event: MouseEvent): boolean {
  const { clientX, clientY } = event;
  const { left, right, top, bottom } = element.getBoundingClientRect();

  const isTop = (top - (borderWidth / 2) < clientY && clientY < top + (borderWidth / 2)) && (left < clientX && clientX < right)
  const isBottom = (bottom - (borderWidth / 2) < clientY && clientY < bottom + (borderWidth / 2)) && (left < clientX && clientX < right)
  const isLeft = (left - (borderWidth / 2) < clientX && clientX < left + (borderWidth / 2)) && (top < clientY && clientY < bottom)
  const isRight = (right - (borderWidth / 2) < clientX && clientX < right + (borderWidth / 2)) && (top < clientY && clientY < bottom)

  const b = {
    t: border === styles.btl || border === styles.btr,
    r: border === styles.btr || border === styles.bbr,
    b: border === styles.bbl || border === styles.bbr,
    l: border === styles.btl || border === styles.bbl,
  };

  return (b.t && isTop) || (b.l && isLeft) || (b.b && isBottom) || (b.r && isRight);
}

function isMouseOverElement(element: HTMLElement, event: MouseEvent): boolean {
  const { clientX, clientY } = event;
  const { left, right, top, bottom } = element.getBoundingClientRect();

  return (left < clientX && clientX < right) && (top < clientY && clientY < bottom)
}