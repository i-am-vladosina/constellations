import { drawTick, drawCircle } from "./utils/drawings";
import { range, inRange, random, keyBy } from "./utils/tools";

// размеры канваса
const STAGE_WIDTH = window.document.documentElement.clientWidth;
const STAGE_HEIGHT = window.document.documentElement.clientHeight;

const dR = 100; // область захвата нод
const NODE_DIAMETR_MIN = 1;
const NODE_DIAMETR_MAX = 8;

type Node = {
  id: number;
  xCoord: number;
  yCoord: number;
  xVel: number;
  yVel: number;
  r: number;
  // ноды, с которыми связана текущая
  links: number[];
};

function isIntersetion({ x1, y1, r1, x2, y2, r2 }) {
  return (x2 - x1) ** 2 + (y2 - y1) ** 2 <= (r1 + r2) ** 2;
}

function distance({ x1, y1, x2, y2 }) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

/**
 *
 * @param similarity Параметр, который определяет схожесть по размеру в процентах
 */
function findSiblingsInRange(similarity: number) {
  return constellations.reduce<Node[]>((acc, c) => {
    // описываем окружность вокруг исследуемой, чтобы найти ее связи
    const siblings = constellations.filter((n) => {
      const k = similarity / 100;
      return (
        // проверяем, чтобы соседняя нода была соразмерна
        inRange(n.r, c.r * (1 - k), c.r * (1 + k)) &&
        // нода уже могла определится как соседняя ранее
        !n.links.includes(c.id) &&
        // проверяем пересечение ноды суммарного радиуса
        isIntersetion({
          x1: c.xCoord,
          y1: c.yCoord,
          r1: c.r + dR,
          x2: n.xCoord,
          y2: n.yCoord,
          r2: n.r,
        })
      );
    });
    c.links = siblings.map((s) => s.id);

    acc.push(c);
    return acc;
  }, []);
}

const constellations: Node[] = range(0, 200).map((i) => {
  const r = random(NODE_DIAMETR_MIN / 2, NODE_DIAMETR_MAX / 2, true);
  return {
    id: i,
    xCoord: random(r, STAGE_WIDTH - r),
    yCoord: random(r, STAGE_HEIGHT - r),
    xVel: Math.random() - 0.5,
    yVel: Math.random() - 0.5,
    r,
    links: [],
  };
});

export function drawConstellations(element: HTMLDivElement) {
  const canvas = document.createElement("canvas");

  canvas.setAttribute("width", `${STAGE_WIDTH}px`);
  canvas.setAttribute("height", `${STAGE_HEIGHT}px`);
  canvas.setAttribute("style", "background: #436eab;");

  element.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "white";
  ctx.strokeStyle = "white";

  const draw = (cb: VoidFunction) => drawTick(ctx, cb);
  const constellationsByKey = keyBy(constellations, "id");

  function drawFrame() {
    ctx.clearRect(0, 0, STAGE_WIDTH, STAGE_HEIGHT);

    const data = findSiblingsInRange(10);

    // рисуем
    data.map((c, key) => {
      // рисуем связи
      c.links.map((id) => {
        draw(() => {
          ctx.moveTo(c.xCoord, c.yCoord);
          const sibling = constellationsByKey[id];
          ctx.lineTo(sibling.xCoord, sibling.yCoord);
          const d = Math.min(dR, distance({ x1: c.xCoord, y1: c.yCoord, x2: sibling.xCoord, y2: sibling.yCoord }));
          // если lineWidth присвоить ноль, то его значение будет дефолтным
          // TODO lineWidth должна быть больше 1, иметь зависимость от радиуса ноды
          ctx.lineWidth = Math.max(0.01, (dR - d) / dR);
        });
      });

      draw(() => {
        ctx.lineWidth = 1;
        drawCircle(ctx, c.xCoord, c.yCoord, c.r);
      });

      c.xCoord += 0.15 * c.xVel;
      c.yCoord += 0.15 * c.yVel;

      // нода упирается в конец экрана
      if (c.xCoord - c.r <= 0 || c.xCoord + c.r >= STAGE_WIDTH) {
        c.xVel *= -1;
      }

      if (c.yCoord - c.r <= 0 || c.yCoord + c.r >= STAGE_HEIGHT) {
        c.yVel *= -1;
      }
    });

    window.requestAnimationFrame(drawFrame);
  }

  drawFrame();
}
