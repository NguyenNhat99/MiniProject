using MediatR;
using Microsoft.AspNetCore.Mvc;
using MiniProjectServer.Application.DTOs;
using MiniProjectServer.Application.Features.StudentFeature.Commands;
using MiniProjectServer.Application.Features.StudentFeature.Queries;

namespace MiniProjectServer.Api.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class StudentController : ControllerBase
    {
        private readonly IMediator _mediator;

        public StudentController(IMediator mediator)
        {
            _mediator = mediator;
        }
        [HttpGet]
        public async Task<ActionResult<List<StudentDto>>> GetAll()
        {
            try
            {
                var students = await _mediator.Send(new GetAllStudentQuery());
                return Ok(students);
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
        [HttpGet("{id}")]
        public async Task<ActionResult<StudentDto>> GetById(Guid id)
        {
            try
            {
                var student = await _mediator.Send(new GetStudentById(id));
                return Ok(student);

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
        public async Task<ActionResult<StudentDto>> Create([FromBody]CreateStudentDto dto)
        {
            try
            {
                var addStudent = await _mediator.Send(new CreateStudentCommand(dto));
                return Ok(addStudent);
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
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                var deleteStudent = await _mediator.Send(new DeleteStudentCommand(id));
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
        [HttpPut("{id}")]
        public async Task<ActionResult<StudentDto>> Update(Guid id, [FromBody] UpdateStudentDto dto)
        {
            try
            {
                var updateStudent = await _mediator.Send(new UpdateStudentCommand(id, dto));
                return Ok(updateStudent);
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
