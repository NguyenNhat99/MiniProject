using MediatR;
using Microsoft.AspNetCore.Mvc;
using MiniProjectServer.Application.DTOs;
using MiniProjectServer.Application.Features.ClassRooms.Commands;
using MiniProjectServer.Application.Features.ClassRooms.Queries;
using System.Transactions;

namespace MiniProjectServer.Api.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClassRoomController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ClassRoomController(IMediator mediator) {
            _mediator = mediator;
        }
        [HttpGet]
        public async Task<ActionResult<List<ClassRoomDto>>> GetAll()
        {
            try
            {
                return Ok(await _mediator.Send(new GetAllClassQuery()));
            }
            catch(KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch(Exception ex)
            {
                return StatusCode(500,ex.Message);
            }
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<ClassRoomDto>> GetById(int id) 
        {
            try
            {
                var classRoom = await _mediator.Send(new GetClassById(id));
                return Ok(classRoom);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
         
        }
        [HttpPost]
        public async Task<ActionResult<ClassRoomDto>> Create([FromBody] CreateClassRoomDto dto)
        {
            try
            {
                var addClass = await _mediator.Send(new CreateClassRoomCommand(dto));
                return Ok(addClass);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
          
        }
        [HttpPut("{id}")]
        public async Task<ActionResult<ClassRoomDto>> Update(int id, [FromBody] UpdateClassRoomDto dto)
        {
            try
            {
                var updateClass = await _mediator.Send(new UpdateClassRoomCommand(id, dto));
                return Ok(updateClass);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
            
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var deleteClass = await _mediator.Send(new DeleteClassRoomCommand(id));
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
            
        }
    }
}
